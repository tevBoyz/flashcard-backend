import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { Flashcard } from './flashcard.entity';
import { GeminiService } from '../gemini-service/gemini.service';
import * as fs from 'fs/promises';

//file upload imports
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
  constructor(private readonly service: FlashcardService, private readonly geminiService: GeminiService) {}

  @Get()
  getAll(): Flashcard[] {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Flashcard {
    return this.service.findOne(+id);
  }

  //For Gemini AI integration
  @Post()
  async generate(@Body('text') text: string) {
    const flashcards = await this.geminiService.generateFlashcards(text);
    return flashcards;
  }

  @Post()
  create(@Body() flashcard: Flashcard): Flashcard {
    return this.service.create(flashcard);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Flashcard>): Flashcard {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    return this.service.remove(+id);
  }

    //File Upload Endpoint
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileExt = path.extname(file.originalname);
          const fileName = `${uuidv4()}${fileExt}`;
          callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 500 * 1024, // 500KB limit
      },
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'text/plain') {
          return callback(new BadRequestException('Only .txt files are allowed'), false);
        }
        callback(null, true);
      }
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('File upload failed or invalid file.');
      }
      
// // 1. Read the text
//     const textContent = await fs.readFile(file.path, 'utf-8');
//     console.log('[DEBUG] File content:', textContent.slice(0, 200)); // Log first 200 chars

//     // 2. Send to Gemini
//     const flashcards = await this.geminiService.generateFlashcards(textContent);
//     console.log('[DEBUG] Flashcards:', flashcards);


      return {
        message: 'File uploaded successfully',
        filePath: file.path,
        originalName: file.originalname
      };
    }
  }
