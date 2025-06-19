import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class GeminiService {
  private genAI;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);

  }
  
  async generateFlashcards(text: string) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Convert the following text into a list of flashcards. 
      Each flashcard should have a question and an answer in this format:
        [
          { "question": "...", "answer": "..." }
        ]

      Follow this rules:
        1. Create comprehensive Q&A pairs covering all key topics
        2. Respond ONLY with valid JSON, no additional text
        3. The question should be short answer format
        3. The answer part should not exceed more than 5 words.

      Text:
      """
      ${text}
      """`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    console.log('[DEBUG] Gemini raw response:', rawText);

    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']') + 1;
    const jsonString = rawText.substring(jsonStart, jsonEnd);

    return JSON.parse(jsonString);
  }
}
