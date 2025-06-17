import { Test, TestingModule } from '@nestjs/testing';
import { GeminiServiceService } from './gemini.service';

describe('GeminiServiceService', () => {
  let service: GeminiServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiServiceService],
    }).compile();

    service = module.get<GeminiServiceService>(GeminiServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
