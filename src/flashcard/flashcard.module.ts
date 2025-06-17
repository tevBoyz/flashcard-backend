import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { GeminiService } from '../gemini-service/gemini.service';


@Module({
  providers: [FlashcardService, GeminiService],
  controllers: [FlashcardController]
})
export class FlashcardModule {}
