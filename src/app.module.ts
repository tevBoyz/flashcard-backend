import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlashcardModule } from './flashcard/flashcard.module';
import { GeminiService } from './gemini-service/gemini.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [FlashcardModule,
  ConfigModule.forRoot({
    isGlobal: true,
  })],
  controllers: [AppController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
