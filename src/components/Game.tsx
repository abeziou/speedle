import Keyboard from './Keyboard'
import { LetterStatus, getLetterStatusOrdinal } from "../types/Types"
import { useEffect, useState } from 'react'
import type { Guess } from '../types/Types'
import WordRowPanel from './WordRowPanel'
import WordData from '../assets/words.json'


const wordLists: Record<string, string[]> = WordData

type GameProps = {
    numberOfGuesses: number;
    rowLength: number;
    wordSetSize: number;
}

// shuffleWords shuffles a word list in place using Fisher-Yates
const shuffleWords = (words: string[]) => {
    for (let i = 0; i < words.length; i++) {
        let j = Math.floor(Math.random() * (words.length + 1))
        let tmp = words[j]
        words[j] = words[i]
        words[i] = tmp
    }
}

// makeGoodGuess returns the results for a guess against a chosen word in a "good" game
const makeGoodGuess = (letters: string[], chosenWord: string): LetterStatus[] => {
    let chosenWordUpper = chosenWord.toUpperCase()
    return letters.map(l => l.toUpperCase()).map((l, i): LetterStatus => {
        if (chosenWordUpper[i] === l) {
            return LetterStatus.CORRECT
        } else if (chosenWordUpper.includes(l)) {
            return LetterStatus.OUT_OF_POSITION
        } else {
            return LetterStatus.NOT_IN_WORD
        }
    })
}

// makeEvilGuess returns the results for a guess against a chosen word in an "evil" game
const makeEvilGuess = (letters: string[], wordSet: string[]): LetterStatus[] => {
    let results: LetterStatus[] = []
    return results
}

const Game = (props: GameProps) => {
    const [lettersStatus, setLetterStatus] = useState<Map<string, LetterStatus>>(new Map<string, LetterStatus>())
    const [pastGuesses, setPastGuesses] = useState<Guess[]>([])
    const [currentLetters, setCurrentLetters] = useState<string[]>([])
    const [isEvil, setIsEvil] = useState<boolean>(false)
    const [chosenWord, setChosenWord] = useState<string>("")
    const [wordSet, setWordSet] = useState<string[]>([])

    useEffect(() => {
        onNewGame()
    }, [])

    const onNewGame = () => {
        setCurrentLetters([])
        setPastGuesses([])
        setLetterStatus(new Map<string, LetterStatus>())

        const lengthKey = props.rowLength.toString()
        if (!(lengthKey in wordLists)) {
            throw new Error(`Invalid row length: ${lengthKey}`)
        }
        let words = wordLists[lengthKey]

        if (isEvil) {
            setChosenWord("")

            shuffleWords(words)
            let newWordSet = []
            for (let i = 0; i < props.wordSetSize && i < words.length; i++) {
                newWordSet.push(words[i])
            }
            setWordSet(wordSet)
        } else {
            setWordSet([])

            let newChosenWord = words[Math.floor(Math.random() * (words.length + 1))]
            setChosenWord(newChosenWord)
        }
    }

    const onKeyPress = (letter: string) => {
        if (currentLetters.length >= props.rowLength) {
            return
        }
        setCurrentLetters(currentLetters.concat(letter))
    }

    const onBackspace = () => {
        setCurrentLetters(currentLetters.slice(0, -1))
    }

    const onEnter = () => {
        if (currentLetters.length != props.rowLength) {
            return
        }

        let newPastGuesses = pastGuesses
        let results: LetterStatus[]
        if (isEvil) {
            results = makeEvilGuess(currentLetters, wordSet)
        } else {
            results = makeGoodGuess(currentLetters, chosenWord)
        }
        let newGuess: Guess = {
            letters: currentLetters,
            results: results
        }
        let newLetterStatus = lettersStatus
        currentLetters.forEach((l, i) => {
            if (!newLetterStatus.has(l)) {
                newLetterStatus.set(l, results[i])
                return
            }
            const oldStatusOrdinal = getLetterStatusOrdinal(newLetterStatus.get(l) ?? LetterStatus.UNGUESSED)
            const newStatusOrdinal = getLetterStatusOrdinal(results[i])
            if (newStatusOrdinal > oldStatusOrdinal) {
                newLetterStatus.set(l, results[i])
                return
            }
        })
        newPastGuesses.push(newGuess)
        setPastGuesses(newPastGuesses)
        setCurrentLetters([])
    }

    return (
        <div>
            <h3>
                <span onClick={() => setIsEvil(!isEvil)} style={{color: isEvil ? "red" : "green"}}>({isEvil ? "EVIL" : "GOOD"})</span> WORDLE
            </h3>
            <WordRowPanel rowCount={props.numberOfGuesses} rowLength={props.rowLength} currentLetters={currentLetters} pastGuesses={pastGuesses} />
            <Keyboard letterStatus={lettersStatus} onKeyPress={onKeyPress} onEnter={onEnter} onBackspace={onBackspace}/>
        </div>
    )
}

export default Game