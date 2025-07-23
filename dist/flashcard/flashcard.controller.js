"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardController = void 0;
const common_1 = require("@nestjs/common");
const flashcard_service_1 = require("./flashcard.service");
const gemini_service_1 = require("../gemini-service/gemini.service");
const fs = require("fs/promises");
const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const AdmZip = require("adm-zip");
const xml2js_1 = require("xml2js");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const uuid_1 = require("uuid");
let FlashcardController = class FlashcardController {
    service;
    geminiService;
    resultGemini;
    constructor(service, geminiService) {
        this.service = service;
        this.geminiService = geminiService;
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_2.BadRequestException('File upload failed or invalid file.');
        }
        try {
            const textContent = await this.extractTextFromFile(file);
            const flashcards = await this.geminiService.generateFlashcards(textContent);
            await fs.unlink(file.path);
            return {
                message: 'File processed successfully',
                flashcards: flashcards,
            };
        }
        catch (error) {
            if (file.path)
                await fs.unlink(file.path).catch(() => { });
            throw new common_2.BadRequestException(error.message || 'Error processing file');
        }
    }
    async extractTextFromFile(file) {
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
        }
        catch (error) {
            throw new Error(`Failed to extract text: ${error.message}`);
        }
    }
    async extractDocxText(filePath) {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        }
        catch (error) {
            throw new Error(`Failed to extract text from DOCX: ${error.message}`);
        }
    }
    async extractTextFromSlide(filePath) {
        try {
            const fileBuffer = await fs.readFile(filePath);
            const zip = new AdmZip(fileBuffer);
            const zipEntries = zip.getEntries();
            let textContent = '';
            for (const entry of zipEntries) {
                if (entry.entryName.match(/ppt\/slides\/slide\d+\.xml/)) {
                    try {
                        const slideContent = entry.getData().toString('utf-8');
                        const slideText = await this.parseSlideContent(slideContent);
                        textContent += slideText + '\n\n';
                    }
                    catch (slideError) {
                        console.warn(`Error processing slide ${entry.entryName}: ${slideError.message}`);
                        continue;
                    }
                }
            }
            if (!textContent.trim()) {
                throw new Error('No readable text content found in PPTX');
            }
            return textContent.trim();
        }
        catch (error) {
            throw new Error(`Failed to extract text from PPTX: ${error.message}`);
        }
    }
    async parseSlideContent(xmlContent) {
        return new Promise((resolve, reject) => {
            const cleanedXml = xmlContent
                .replace(/^\uFEFF/, '')
                .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
            (0, xml2js_1.parseString)(cleanedXml, { explicitArray: false }, (err, result) => {
                if (err) {
                    return reject(new Error(`XML parsing error: ${err.message}`));
                }
                try {
                    let slideText = '';
                    const processText = (element) => {
                        if (typeof element === 'string') {
                            slideText += element + ' ';
                        }
                        else if (element?.['a:t']) {
                            slideText += element['a:t'] + ' ';
                        }
                        else if (element?.['a:r']?.['a:t']) {
                            slideText += element['a:r']['a:t'] + ' ';
                        }
                        else if (Array.isArray(element)) {
                            element.forEach(processText);
                        }
                        else if (typeof element === 'object') {
                            Object.values(element).forEach(processText);
                        }
                    };
                    const shapes = result?.['p:sld']?.['p:cSld']?.['p:spTree']?.['p:sp'] || [];
                    shapes.forEach((shape) => {
                        const textBody = shape?.['p:txBody'];
                        if (textBody) {
                            processText(textBody);
                        }
                    });
                    resolve(slideText.trim());
                }
                catch (parseError) {
                    reject(new Error(`Slide content processing error: ${parseError.message}`));
                }
            });
        });
    }
};
exports.FlashcardController = FlashcardController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const fileExt = path.extname(file.originalname);
                const fileName = `${(0, uuid_1.v4)()}${fileExt}`;
                callback(null, fileName);
            },
        }),
        fileFilter: (req, file, callback) => {
            const sizeLimits = {
                'text/plain': 2 * 1024 * 1024,
                'application/pdf': 10 * 1024 * 1024,
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 15 * 1024 * 1024,
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': 20 * 1024 * 1024,
            };
            if (!sizeLimits[file.mimetype]) {
                return callback(new common_2.BadRequestException('Only .txt, .pdf, .docx, and .pptx files are allowed'), false);
            }
            if (file.size > sizeLimits[file.mimetype]) {
                const fileType = path.extname(file.originalname).toUpperCase();
                return callback(new common_2.BadRequestException(`File too large. Max size for ${fileType} files is ${sizeLimits[file.mimetype] / (1024 * 1024)}MB`), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlashcardController.prototype, "uploadFile", null);
exports.FlashcardController = FlashcardController = __decorate([
    (0, common_1.Controller)('flashcards'),
    __metadata("design:paramtypes", [flashcard_service_1.FlashcardService,
        gemini_service_1.GeminiService])
], FlashcardController);
//# sourceMappingURL=flashcard.controller.js.map