import { ConfigService } from '@nestjs/config';
export declare class GeminiService {
    private readonly configService;
    private genAI;
    constructor(configService: ConfigService);
    generateFlashcards(text: string): Promise<any>;
}
