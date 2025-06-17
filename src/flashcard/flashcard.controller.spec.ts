import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardController } from './flashcard.controller';

describe('FlashcardController', () => {
  let controller: FlashcardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardController],
    }).compile();

    controller = module.get<FlashcardController>(FlashcardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
