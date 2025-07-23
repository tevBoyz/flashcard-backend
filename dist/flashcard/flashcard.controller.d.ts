import { FlashcardService } from './flashcard.service';
import { GeminiService } from '../gemini-service/gemini.service';
export declare class FlashcardController {
    private readonly service;
    private readonly geminiService;
    resultGemini: string;
    constructor(service: FlashcardService, geminiService: GeminiService);
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        flashcards: any;
    }>;
    private extractTextFromFile;
    private extractDocxText;
    private extractTextFromSlide;
    private parseSlideContent;
}
