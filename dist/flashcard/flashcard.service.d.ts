import { Flashcard } from './flashcard.entity';
export declare class FlashcardService {
    private flashcards;
    findAll(): Flashcard[];
    findOne(id: number): Flashcard;
    create(flashcard: Flashcard): Flashcard;
    update(id: number, data: Partial<Flashcard>): Flashcard;
    remove(id: number): void;
}
