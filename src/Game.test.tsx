import { makeGuess } from "./Game"
import { LetterStatus } from "./types/Types"

describe('test making guesses', () => {
    test("correct guess should have all correct statuses", () => {
        let guess = "GUESS".split("")
        let chosenWord = "GUESS"
        let statuses = makeGuess(guess, chosenWord)
        expect(statuses.filter(s => s !== LetterStatus.CORRECT)).toHaveLength(0)
    })

    test("incorrect guess should have all NOT_IN_WORD statuses", () => {
        let guess = "AAAAA".split("")
        let chosenWord = "BBBBB"
        let statuses = makeGuess(guess, chosenWord)
        expect(statuses.filter(s => s !== LetterStatus.NOT_IN_WORD)).toHaveLength(0)
    })

    test("guess with one letter out of position should have one OUT_OF_POSITION status, rest NOT_IN_WORD", () => {
        let guess = "AAAAC".split("")
        let chosenWord = "CBBBB"
        let statuses = makeGuess(guess, chosenWord)
        expect(statuses).toMatchObject([
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.OUT_OF_POSITION,
        ])
    })

    test("guess with one correct letter should have one CORRECT status, rest NOT_IN_WORD", () => {
        let guess = "CAAAA".split("")
        let chosenWord = "CBBBB"
        let statuses = makeGuess(guess, chosenWord)
        expect(statuses).toMatchObject([
            LetterStatus.CORRECT,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
        ])
    })

    test("guess with same letter out of position & in position should only mark in-position", () => {
        let guess = "CAAAC".split("")
        let chosenWord = "CBBBB"
        let statuses = makeGuess(guess, chosenWord)
        expect(statuses).toMatchObject([
            LetterStatus.CORRECT,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
        ])

        guess = "CAAAC".split("")
        chosenWord = "BBBBC"
        statuses = makeGuess(guess, chosenWord)
        expect(statuses).toMatchObject([
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.NOT_IN_WORD,
            LetterStatus.CORRECT,
        ])
    })
})