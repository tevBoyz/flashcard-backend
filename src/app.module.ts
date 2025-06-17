import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlashcardModule } from './flashcard/flashcard.module';

@Module({
  imports: [FlashcardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
