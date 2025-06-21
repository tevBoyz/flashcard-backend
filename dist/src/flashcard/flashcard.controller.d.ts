import { FlashcardService } from './flashcard.service';
import { Flashcard } from './flashcard.entity';
import { GeminiService } from '../gemini-service/gemini.service';
export declare class FlashcardController {
    private readonly service;
    private readonly geminiService;
    resultGemini: string;
    constructor(service: FlashcardService, geminiService: GeminiService);
    getAll(): Flashcard[];
    getOne(id: string): Flashcard;
    generate(text: string): Promise<any>;
    create(flashcard: Flashcard): Flashcard;
    update(id: string, data: Partial<Flashcard>): Flashcard;
    remove(id: string): void;
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        flashcards: any;
    }>;
}
