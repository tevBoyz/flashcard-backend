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
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      You are an expert at generating educational flashcards from text.

      Given the text below, generate a JSON array of flashcards that follow these rules:
        - Each flashcard is an object: { "question": "...", "answer": "..." }
        - Cover **all important facts and ideas** from the text — do not miss anything.
        - Use various suitable flashcard types: short answer, true/false, fill-in-the-blank, etc.
        - Make the **questions descriptive and self-contained** so they make sense without needing the full text.
        - Answers must be **short**, **clear**, and **no longer than 6 words, unless it is necessary.**.
        - Use long answers only if they need more explanation to make a point.
        - Use **natural language and proper grammar**.
        - Punctuations are important. Use question marks and others punctuation for the questions and answers.
        - Maintain the text language as it is. Do not translate to English. Make sure the question and answer are the same language as the text provided.
        - Format the output as **pure JSON only** — no explanations or extra text.

      Text:
      """
      ${text}
      """
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']') + 1;
    const jsonString = rawText.substring(jsonStart, jsonEnd);
    const data = JSON.parse(jsonString);
    
    return JSON.parse(jsonString);
  }
}
