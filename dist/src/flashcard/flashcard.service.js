"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardService = void 0;
const common_1 = require("@nestjs/common");
let FlashcardService = class FlashcardService {
    flashcards = [
        { "id": 1, "question": "What has to be broken before you can use it?", "answer": "An egg" },
        { "id": 2, "question": "What gets wetter the more it dries?", "answer": "A towel" },
        { "id": 3, "question": "What is the tallest animal in the world?", "answer": "Giraffe" },
        { "id": 4, "question": "Which planet is known as the Red Planet?", "answer": "Mars" },
        { "id": 5, "question": "How many legs does a spider have?", "answer": "Eight" },
        { "id": 6, "question": "What is the fastest land animal?", "answer": "Cheetah" },
        { "id": 7, "question": "Which bird is often associated with delivering babies?", "answer": "Stork" },
        { "id": 8, "question": "What do bees collect and use to make honey?", "answer": "Nectar" },
        { "id": 9, "question": "What color are Smurfs?", "answer": "Blue" },
        { "id": 10, "question": "What goes up but never comes down?", "answer": "Your age" },
        { "id": 11, "question": "How many continents are there?", "answer": "Seven" },
        { "id": 12, "question": "What’s the capital of Japan?", "answer": "Tokyo" },
        { "id": 13, "question": "What’s 9 x 9?", "answer": "81" },
        { "id": 14, "question": "What’s the name of the toy cowboy in Toy Story?", "answer": "Woody" },
        { "id": 15, "question": "What is the opposite of 'up'?", "answer": "Down" },
        { "id": 16, "question": "What do you call a group of lions?", "answer": "A pride" },
        { "id": 17, "question": "What do caterpillars become?", "answer": "Butterflies" },
        { "id": 18, "question": "What is the name of the pirate in Peter Pan?", "answer": "Captain Hook" },
        { "id": 19, "question": "Which animal is known as the King of the Jungle?", "answer": "Lion" },
        { "id": 20, "question": "What is the hardest natural substance on Earth?", "answer": "Diamond" }
    ];
    findAll() {
        return this.flashcards;
    }
    findOne(id) {
        const flashcard = this.flashcards.find(f => f.id === id);
        if (!flashcard)
            throw new common_1.NotFoundException('Flashcard not found');
        return flashcard;
    }
    create(flashcard) {
        const newCard = { ...flashcard, id: Date.now() };
        this.flashcards.push(newCard);
        return newCard;
    }
    update(id, data) {
        const index = this.flashcards.findIndex(f => f.id === id);
        if (index === -1)
            throw new common_1.NotFoundException('Flashcard not found');
        this.flashcards[index] = { ...this.flashcards[index], ...data };
        return this.flashcards[index];
    }
    remove(id) {
        const index = this.flashcards.findIndex(f => f.id === id);
        if (index === -1)
            throw new common_1.NotFoundException('Flashcard not found');
        this.flashcards.splice(index, 1);
    }
};
exports.FlashcardService = FlashcardService;
exports.FlashcardService = FlashcardService = __decorate([
    (0, common_1.Injectable)()
], FlashcardService);
//# sourceMappingURL=flashcard.service.js.map