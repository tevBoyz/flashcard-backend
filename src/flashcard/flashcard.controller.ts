import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { Flashcard } from './flashcard.entity';

@Controller('flashcards')
export class FlashcardController {
  constructor(private readonly service: FlashcardService) {}

  @Get()
  getAll(): Flashcard[] {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Flashcard {
    return this.service.findOne(+id);
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
}
