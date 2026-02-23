export const LetterStatus = {
    UNGUESSED: "unguessed",
    NOT_IN_WORD: "notInWord",
    OUT_OF_POSITION: "outOfPosition",
    CORRECT: "correct"
} as const
export type LetterStatus = typeof LetterStatus[keyof typeof LetterStatus]


export type Guess = {
    letters: string[];
    results: LetterStatus[];
}