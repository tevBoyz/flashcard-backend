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
      You are an expert at generating educational flashcards from text.

      Given the text below, generate a JSON array of flashcards that follow these rules:
        - Each flashcard is an object: { "question": "...", "answer": "..." }
        - Cover **all important facts and ideas** from the text — do not miss anything.
        - Use various suitable flashcard types: short answer, true/false, fill-in-the-blank, etc.
        - Make the **questions descriptive and self-contained** so they make sense without needing the full text.
        - Answers must be **short**, **clear**, and **no longer than 4 words**.
        - Use **natural language and proper grammar**.
        - Format the output as **pure JSON only** — no explanations or extra text.

      Text:
      """
      ${text}
      """
    `;


    // const prompt = `
    //   Convert the following text into a list of flashcards. 
    //   Each flashcard should have a question and an answer in this format:
    //     [
    //       { "question": "...", "answer": "..." }
    //     ]

    //   Follow this rules:
    //     1. Create comprehensive Q&A pairs covering all key topics
    //     2. Respond ONLY with valid JSON, no additional text
    //     3. The question types can be short answer or True or false
    //     4. The answers should not exceed more than 4 words.
    //     5. Make the quesions more decriptive, longer sentences.

    //   Text:
    //   """
    //   ${text}
    //   """`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    //console.log('[DEBUG] Gemini raw response:', rawText);

    const jsonStart = rawText.indexOf('[');
    const jsonEnd = rawText.lastIndexOf(']') + 1;
    const jsonString = rawText.substring(jsonStart, jsonEnd);

    return JSON.parse(jsonString);
  }
}
