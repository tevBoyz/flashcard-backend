import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardService } from './flashcard.service';

describe('FlashcardService', () => {
  let service: FlashcardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardService],
    }).compile();

    service = module.get<FlashcardService>(FlashcardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
