import Keyboard from './Keyboard'
import { GameResult, LetterStatus, getLetterStatusOrdinal } from "../types/Types"
import { useEffect, useState } from 'react'
import { type Guess, type GameSettings, GameState } from '../types/Types'
import WordRowPanel from './WordRowPanel'
import ResultDialog from './ResultDialog'
import { ValidChoiceList, ValidGuessSet, WORD_LENGTH } from '../words/Constants'


type GameProps = {
    numberOfGuesses: number;
    rowLength: number;
    wordSetSize: number;
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

const getDefaultSettings = () => {
    let defaultSettings: GameSettings = {
        numberOfGuesses: 5,
        wordSetSize: 30,
        isEvil: false
    }
    return defaultSettings
}

const createNewGame = (settings: GameSettings) => {
    let newGame = new GameState

    if (settings.isEvil) {
        let newWordSet = []
        for (let i = 0; i < settings.wordSetSize && i < ValidChoiceList.length; i++) {
            let selectedWordIndex = Math.floor(Math.random() * (ValidChoiceList.length + 1))
            newWordSet.push(ValidChoiceList[selectedWordIndex])
        }
        newGame.wordSet = newWordSet
    } else {
        let newChosenWord = ValidChoiceList[Math.floor(Math.random() * (ValidChoiceList.length + 1))]
        newGame.chosenWord = newChosenWord
    }
    return newGame
}

const Game = () => {
    const [currentLetters, setCurrentLetters] = useState<string[]>([])
    const [settings, setSettings] = useState<GameSettings>(getDefaultSettings())
    const [errorMessage, setErrorMessage] = useState<null|string>(null)
    const [gameState, setGameState] = useState<GameState>(createNewGame(getDefaultSettings()))
    const [isResultsVisible, setIsResultsVisible] = useState<boolean>(false)

    const onNewGame = () => {
        setCurrentLetters([])
        setGameState(createNewGame(settings))
    }

    const onKeyPress = (letter: string) => {
        if (currentLetters.length >= WORD_LENGTH) {
            return
        }
        setCurrentLetters(currentLetters.concat(letter))
    }

    const onBackspace = () => {
        setCurrentLetters(currentLetters.slice(0, -1))
    }

    const onEnter = () => {
        if (currentLetters.length != WORD_LENGTH) {
            setErrorMessage("Not enough letters")
            return
        }
        if (!ValidGuessSet.has(currentLetters.join("").toLowerCase())) {
            setErrorMessage("Not in word list")
            return
        }

        let results: LetterStatus[]
        if (gameState.isEvil) {
            results = makeEvilGuess(currentLetters, gameState.wordSet)
        } else {
            results = makeGoodGuess(currentLetters, gameState.chosenWord)
        }

        // Check if game is won or lost
        if (results.every(r => r === LetterStatus.CORRECT)) {
            gameState.result = GameResult.WON
        } else if (gameState.pastGuesses.length === settings.numberOfGuesses - 1) {
            gameState.result = GameResult.LOST
        }

        let newGuess: Guess = {
            letters: currentLetters,
            results: results
        }
        gameState.pastGuesses.push(newGuess)
        let newLetterStatus = gameState.lettersStatus
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
        gameState.lettersStatus = newLetterStatus


        setGameState(gameState)
        setCurrentLetters([])
    }

    return (
        <div>
            <h3>
                <span style={{color: settings.isEvil ? "red" : "green"}}>({settings.isEvil ? "EVIL" : "GOOD"})</span> WORDLE
            </h3>
            <WordRowPanel rowCount={settings.numberOfGuesses} rowLength={WORD_LENGTH} currentLetters={currentLetters} pastGuesses={gameState.pastGuesses} />
            {errorMessage !== null && <span style={{color: "red"}}>{errorMessage}</span>}
            <Keyboard 
                letterStatus={gameState.lettersStatus} 
                onKeyPress={onKeyPress} 
                onEnter={onEnter} 
                onBackspace={onBackspace}
                disabled={gameState.result !== undefined}
            />
            <ResultDialog 
                isVisible={isResultsVisible} 
                setIsVisible={setIsResultsVisible} 
                onNewGame={onNewGame} 
                result={gameState.result} 
                getCorrectWord={gameState.getCorrectWord}
            />
        </div>
    )
}

export default Game