import { Injectable, NotFoundException } from '@nestjs/common';
import { Flashcard } from './flashcard.entity';

@Injectable()
export class FlashcardService {
  private flashcards: Flashcard[] = [
    {
      "id": 1,
      "question": "What is a software process?",
      "answer": "A set of activities, methods, practices, and transformations used to develop and maintain software systems."
    },
    {
      "id": 2,
      "question": "What are the four fundamental activities in all software processes?",
      "answer": "Specification, Development, Validation, and Evolution."
    },
    {
      "id": 3,
      "question": "What is the Waterfall model?",
      "answer": "A linear and sequential software development model where each phase must be completed before the next begins."
    },
    {
      "id": 4,
      "question": "What are the main phases of the Waterfall model?",
      "answer": "Requirements analysis, System design, Implementation, Integration testing, and Operation/maintenance."
    },
    {
      "id": 5,
      "question": "What is the main drawback of the Waterfall model?",
      "answer": "Difficulty accommodating changes after the process is underway."
    },
    {
      "id": 6,
      "question": "What is the V-Shaped model?",
      "answer": "A variant of Waterfall that emphasizes verification and validation, with testing planned in parallel with development phases."
    },
    {
      "id": 7,
      "question": "What is Evolutionary Prototyping?",
      "answer": "A model where developers build a prototype during requirements phase which is refined based on user feedback until satisfaction."
    },
    {
      "id": 8,
      "question": "What is Incremental Development?",
      "answer": "Development broken into increments with each delivering part of the functionality, with requirements frozen for current increment."
    },
    {
      "id": 9,
      "question": "What is the difference between incremental and iterative development?",
      "answer": "Incremental means adding functionality in pieces, while iterative means reworking and improving existing functionality."
    },
    {
      "id": 10,
      "question": "What is the Spiral model?",
      "answer": "A risk-driven model combining iterative and waterfall approaches, with phases represented as loops in a spiral."
    },
    {
      "id": 11,
      "question": "What are the four sectors of the Spiral model?",
      "answer": "Objective setting, Risk assessment, Development/validation, and Planning."
    },
    {
      "id": 12,
      "question": "What is RAD (Rapid Application Development)?",
      "answer": "A model emphasizing quick development through workshops, user description, construction with tools, and cutover."
    },
    {
      "id": 13,
      "question": "What are the four phases of RUP (Rational Unified Process)?",
      "answer": "Inception, Elaboration, Construction, and Transition."
    },
    {
      "id": 14,
      "question": "What are Agile methods?",
      "answer": "Methods focusing on code over design, iterative development, and quick response to changing requirements."
    },
    {
      "id": 15,
      "question": "What are three popular Agile methods?",
      "answer": "Scrum, Extreme Programming (XP), and Kanban."
    },
    {
      "id": 16,
      "question": "What is Component-Based Development?",
      "answer": "An approach emphasizing reuse of existing software components to construct complex systems."
    },
    {
      "id": 17,
      "question": "What are Fourth-Generation Techniques (4GT)?",
      "answer": "High-level development approaches that minimize coding effort using non-procedural specifications and automated tools."
    },
    {
      "id": 18,
      "question": "When is the Waterfall model most appropriate?",
      "answer": "When requirements are very well known, product definition is stable, and technology is understood."
    },
    {
      "id": 19,
      "question": "What is a key strength of the Spiral model?",
      "answer": "It provides early indication of challenging risks without much cost."
    },
    {
      "id": 20,
      "question": "What is a major weakness of Evolutionary Prototyping?",
      "answer": "Tendency to abandon structured development for 'code-and-fix' approaches."
    }
  ];

  findAll(): Flashcard[] {
    return this.flashcards;
  }

  findOne(id: number): Flashcard {
    const flashcard = this.flashcards.find(f => f.id === id);
    if (!flashcard) throw new NotFoundException('Flashcard not found');
    return flashcard;
  }

  create(flashcard: Flashcard): Flashcard {
    const newCard = { ...flashcard, id: Date.now() };
    this.flashcards.push(newCard);
    return newCard;
  }

  update(id: number, data: Partial<Flashcard>): Flashcard {
    const index = this.flashcards.findIndex(f => f.id === id);
    if (index === -1) throw new NotFoundException('Flashcard not found');
    this.flashcards[index] = { ...this.flashcards[index], ...data };
    return this.flashcards[index];
  }

  remove(id: number): void {
    const index = this.flashcards.findIndex(f => f.id === id);
    if (index === -1) throw new NotFoundException('Flashcard not found');
    this.flashcards.splice(index, 1);
  }
}
