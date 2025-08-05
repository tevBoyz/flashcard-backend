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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("@nestjs/config");
let GeminiService = class GeminiService {
    configService;
    genAI;
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables.');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async generateFlashcards(text) {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `
      You are an expert at generating educational flashcards from text.

      Given the text below, generate a JSON array of flashcards that follow these rules:
        - Each flashcard is an object: { "question": "...", "answer": "..." }
        - Cover **all important facts and ideas** from the text — do not miss anything.
        - Use various suitable flashcard types: short answer, true/false, fill-in-the-blank, etc.
        - Make the **questions descriptive and self-contained** so they make sense without needing the full text.
        - Answers must be **short**, **clear**, and **no longer than 6 words, unless it is necessary.**.
        - Use long answers only if they need more explanation to make a point.
        - Use **natural language and proper grammar**.
        - Punctuations are important. Use question marks and others punctuation for the questions and answers.
        - Maintain the text language as it is. Do not translate to English. Make sure the question and answer are the same language as the text provided.
        - Format the output as **pure JSON only** — no explanations or extra text.

      Text:
      """
      ${text}
      """
    `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawText = response.text();
        const jsonStart = rawText.indexOf('[');
        const jsonEnd = rawText.lastIndexOf(']') + 1;
        const jsonString = rawText.substring(jsonStart, jsonEnd);
        const data = JSON.parse(jsonString);
        return JSON.parse(jsonString);
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map