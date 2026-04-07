export const LetterStatus = {
    UNGUESSED: "unguessed",
    NOT_IN_WORD: "notInWord",
    OUT_OF_POSITION: "outOfPosition",
    CORRECT: "correct"
} as const
export type LetterStatus = typeof LetterStatus[keyof typeof LetterStatus]

export const getLetterStatusOrdinal = (ls: LetterStatus): number => {
    switch(ls) {
        case LetterStatus.UNGUESSED:
            return 0
        case LetterStatus.NOT_IN_WORD:
            return 1
        case LetterStatus.OUT_OF_POSITION:
            return 2
        case LetterStatus.CORRECT:
            return 3
        default:
            return -1
    }
}

export const GameResult = {
    WON: "won",
    LOST: "lost"
} as const
export type GameResult = typeof GameResult[keyof typeof GameResult]

export type Guess = {
    letters: string[];
    results: LetterStatus[];
}

export class GameState {
    lettersStatus: Map<string, LetterStatus> = new Map<string, LetterStatus>;
    pastGuesses: Guess[]= [];
    isEvil: boolean = false;
    chosenWord: string = "";
    wordSet: string[] = [];
    result?: GameResult = undefined;

    getCorrectWord() {
        if (this.isEvil) {
            let randomIndex = Math.floor(Math.random() * (this.wordSet.length + 1))
            return this.wordSet[randomIndex]
        } else {    
            return this.chosenWord
        }
    }
}

export type GameSettings = {
    numberOfGuesses: number,
    wordSetSize: number,
    isEvil: boolean
}