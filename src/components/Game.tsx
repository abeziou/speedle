import Keyboard from './Keyboard'
import { LetterStatus } from "../types/Types"
import { useState } from 'react'
import type { Guess } from '../types/Types'
import WordRowPanel from './WordRowPanel'

const numberOfGuesses = 5
const rowLength = 5

const Game = () => {
    const [lettersStatus, setLetterStatus] = useState<Map<string, LetterStatus>>(new Map<string, LetterStatus>())
    const [pastGuesses, setPastGuesses] = useState<Guess[]>([])
    const [currentLetters, setCurrentLetters] = useState<string[]>([])

    const onKeyPress = (letter: string) => {
        if (currentLetters.length >= rowLength) {
            return
        }
        setCurrentLetters(currentLetters.concat(letter))
    }

    const onBackspace = () => {
        setCurrentLetters(currentLetters.slice(0, -1))
    }

    const onEnter = () => {
        if (currentLetters.length != rowLength) {
            return
        }

        let newPastGuesses = pastGuesses
        setPastGuesses(newPastGuesses)
        setCurrentLetters([])
    }

    return (
        <div>
            <WordRowPanel rowCount={numberOfGuesses} rowLength={rowLength} currentLetters={currentLetters} pastGuesses={pastGuesses} />
            <Keyboard letterStatus={lettersStatus} onKeyPress={onKeyPress} onEnter={onEnter} onBackspace={onBackspace}/>
        </div>
    )
}

export default Game