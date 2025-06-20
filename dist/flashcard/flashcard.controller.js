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
const flashcard_entity_1 = require("./flashcard.entity");
const gemini_service_1 = require("../gemini-service/gemini.service");
const fs = require("fs/promises");
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
    getAll() {
        return this.service.findAll();
    }
    getOne(id) {
        return this.service.findOne(+id);
    }
    async generate(text) {
        const flashcards = await this.geminiService.generateFlashcards(text);
        return flashcards;
    }
    create(flashcard) {
        return this.service.create(flashcard);
    }
    update(id, data) {
        return this.service.update(+id, data);
    }
    remove(id) {
        return this.service.remove(+id);
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_2.BadRequestException('File upload failed or invalid file.');
        }
        const textContent = await fs.readFile(file.path, 'utf-8');
        const flashcards = await this.geminiService.generateFlashcards(textContent);
        return {
            message: 'File uploaded successfully',
            flashcards: flashcards
        };
    }
};
exports.FlashcardController = FlashcardController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], FlashcardController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", flashcard_entity_1.Flashcard)
], FlashcardController.prototype, "getOne", null);
__decorate([
    (0, common_1.Post)('gemini'),
    __param(0, (0, common_1.Body)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FlashcardController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [flashcard_entity_1.Flashcard]),
    __metadata("design:returntype", flashcard_entity_1.Flashcard)
], FlashcardController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", flashcard_entity_1.Flashcard)
], FlashcardController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FlashcardController.prototype, "remove", null);
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
        limits: {
            fileSize: 500 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (file.mimetype !== 'text/plain') {
                return callback(new common_2.BadRequestException('Only .txt files are allowed'), false);
            }
            callback(null, true);
        }
    })),
    __param(0, (0, common_2.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FlashcardController.prototype, "uploadFile", null);
exports.FlashcardController = FlashcardController = __decorate([
    (0, common_1.Controller)('flashcards'),
    __metadata("design:paramtypes", [flashcard_service_1.FlashcardService, gemini_service_1.GeminiService])
], FlashcardController);
//# sourceMappingURL=flashcard.controller.js.map