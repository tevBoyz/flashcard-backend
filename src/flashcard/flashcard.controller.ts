import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { Flashcard } from './flashcard.entity';
import { GeminiService } from '../gemini-service/gemini.service';
import * as fs from 'fs/promises';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as unzipper from 'unzipper';
import * as AdmZip from 'adm-zip';
import { parseString } from 'xml2js';


// File upload imports
import {
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('flashcards')
export class FlashcardController {
  resultGemini: string; // In-memory storage for simplicity
  constructor(
    private readonly service: FlashcardService,
    private readonly geminiService: GeminiService,
  ) {}

  // ... (keep your existing methods unchanged)

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${uuidv4()}${fileExt}`;
          callback(null, fileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        const sizeLimits = {
          'text/plain': 3 * 1024 * 1024, // 2MB for TXT
          'application/pdf': 3 * 1024 * 1024, // 10MB for PDF
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 3 * 1024 * 1024, // 15MB for DOCX
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': 3 * 1024 * 1024, // 20MB for PPTX
        };

        if (!sizeLimits[file.mimetype]) {
          return callback(
            new BadRequestException(
              'Only .txt, .pdf, .docx, and .pptx files are allowed',
            ),
            false,
          );
        }

        if (file.size > sizeLimits[file.mimetype]) {
          const fileType = path.extname(file.originalname).toUpperCase();
          return callback(
            new BadRequestException(
              `File too large. Max size for ${fileType} files is ${
                sizeLimits[file.mimetype] / (1024 * 1024)
              }MB`,
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed or invalid file.');
    }

    try {
      const textContent = await this.extractTextFromFile(file);
      const flashcards = await this.geminiService.generateFlashcards(textContent);
      
      await fs.unlink(file.path); // Clean up file
      
      return {
        message: 'File processed successfully',
        flashcards: flashcards,
      };
    } catch (error) {
      if (file.path) await fs.unlink(file.path).catch(() => {});
      throw new BadRequestException(
        error.message || 'Error processing file',
      );
    }
  }

  private async extractTextFromFile(file: Express.Multer.File): Promise<string> {
    try {
      switch (file.mimetype) {
        case 'text/plain':
          return await fs.readFile(file.path, 'utf-8');

        case 'application/pdf':
          const pdfBuffer = await fs.readFile(file.path);
          const pdfData = await pdf(pdfBuffer);
          return pdfData.text;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.extractDocxText(file.path);

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return await this.extractTextFromSlide(file.path);

        default:
          throw new Error('Unsupported file type');
      }
    } catch (error) {
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  private async extractDocxText(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value; // The raw text
    } catch (error) {
      throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
  }

private async extractTextFromSlide(filePath: string): Promise<string> {
  try {
        // Read the PPTX file
        const fileBuffer = await fs.readFile(filePath);
        const zip = new AdmZip(fileBuffer);
        const zipEntries = zip.getEntries();
        
        let textContent = '';

        // Process each slide
        for (const entry of zipEntries) {
            if (entry.entryName.match(/ppt\/slides\/slide\d+\.xml/)) {
                try {
                    const slideContent = entry.getData().toString('utf-8');
                    const slideText = await this.parseSlideContent(slideContent);
                    textContent += slideText + '\n\n';
                } catch (slideError) {
                    console.warn(`Error processing slide ${entry.entryName}: ${slideError.message}`);
                    continue;
                }
            }
        }

        if (!textContent.trim()) {
            throw new Error('No readable text content found in PPTX');
        }

        return textContent.trim();
    } catch (error) {
        throw new Error(`Failed to extract text from PPTX: ${error.message}`);
    }
}

private async parseSlideContent(xmlContent: string): Promise<string> {
    return new Promise((resolve, reject) => {
        // First clean the XML content to remove any invalid characters
        const cleanedXml = xmlContent
            .replace(/^\uFEFF/, '') // Remove BOM if present
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters

        parseString(cleanedXml, { explicitArray: false }, (err, result) => {
            if (err) {
                return reject(new Error(`XML parsing error: ${err.message}`));
            }

            try {
                let slideText = '';
                const processText = (element: any) => {
                    if (typeof element === 'string') {
                        slideText += element + ' ';
                    } else if (element?.['a:t']) {
                        slideText += element['a:t'] + ' ';
                    } else if (element?.['a:r']?.['a:t']) {
                        slideText += element['a:r']['a:t'] + ' ';
                    } else if (Array.isArray(element)) {
                        element.forEach(processText);
                    } else if (typeof element === 'object') {
                        Object.values(element).forEach(processText);
                    }
                };

                // Navigate through the PowerPoint XML structure
                const shapes = result?.['p:sld']?.['p:cSld']?.['p:spTree']?.['p:sp'] || [];
                shapes.forEach((shape: any) => {
                    const textBody = shape?.['p:txBody'];
                    if (textBody) {
                        processText(textBody);
                    }
                });

                resolve(slideText.trim());
            } catch (parseError) {
                reject(new Error(`Slide content processing error: ${parseError.message}`));
            }
        });
    });
}

}