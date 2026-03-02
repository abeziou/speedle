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

export type Guess = {
    letters: string[];
    results: LetterStatus[];
}