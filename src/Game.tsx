import Keyboard from './components/Keyboard'
import { GameStatus, LetterStatus, getLetterStatusOrdinal } from "./types/Types"
import { useEffect, useRef, useState } from 'react'
import { type Guess } from './types/Types'
import WordRowPanel from './components/WordRowPanel'
import { COUNTDOWN_TIME_SECONDS, ERROR_MESSAGE_SHOW_LENGTH, ValidChoiceList, ValidGuessSet, WORD_LENGTH } from './constants/Constants'
import CountdownTimer from './components/CountdownTimer'
import Score from './components/Score'

// makeGuess returns the results for a guess against a chosen word
export const makeGuess = (letters: string[], chosenWord: string): LetterStatus[] => {
    if (letters.length !== chosenWord.length) {
        return []
    }
    
    let letterCountInChosenWord = new Map<string, number>()
    let letterIndicesInChosenWord = new Map<string, Set<number>>()
    let chosenWordUpper = chosenWord.toUpperCase()
    for (const [i, l] of chosenWordUpper.split("").entries()) {
        letterCountInChosenWord.set(l, (letterCountInChosenWord.get(l) ?? 0) + 1)
        letterIndicesInChosenWord.set(l, (letterIndicesInChosenWord.get(l) ?? new Set()).add(i))
    }

    let correctGuessesPerLetter = new Map<string, number>()
    let oopGuessesPerLetter = new Map<string, number>()
    let lettersUpper = letters.map(l => l.toUpperCase())
    for (const [i, l] of lettersUpper.entries()) {
        if (l === chosenWordUpper[i]) {
            correctGuessesPerLetter.set(l, (correctGuessesPerLetter.get(l) ?? 0) + 1)
        }
    }

    let letterStatuses: LetterStatus[] = []
    for (const [i, l] of lettersUpper.entries()) {
        let correctIndices = letterIndicesInChosenWord.get(l) ?? new Set()
        if (correctIndices.size > 0) {
            // There are correct positions for this letter, can be CORRECT or OUT OF POSITION
            if (correctIndices.has(i)) {
                // This is in a correct position for this letter, it's CORRECT
                letterStatuses.push(LetterStatus.CORRECT)
                continue
            }
            
            // Count of OUT OF POSITION + CORRECT positions cannot exceed the count of this letter in the chosen word
            let correctCount = correctGuessesPerLetter.get(l) ?? 0
            let oopCount = oopGuessesPerLetter.get(l) ?? 0
            let maxOutOfPositionCount = correctIndices.size - correctCount
            if (oopCount < maxOutOfPositionCount) {
                // Adding this OUT OF POSITION count won't exceed count of letters in chosen word
                letterStatuses.push(LetterStatus.OUT_OF_POSITION)
                oopGuessesPerLetter.set(l, oopCount + 1)
                continue
            }
        }
        letterStatuses.push(LetterStatus.NOT_IN_WORD)
    }
    return letterStatuses
}

const Game = () => {
    const [currentLetters, setCurrentLetters] = useState<string[]>([])
    const [errorMessage, setErrorMessage] = useState<string|undefined>()
    const [countdownTime, setCountdownTime] = useState<number>(COUNTDOWN_TIME_SECONDS)
    const [letterStatus, setLetterStatus] = useState<Map<string, LetterStatus>>(new Map<string, LetterStatus>());
    const [pastGuesses, setPastGuesses] = useState<Guess[]>([])
    const [chosenWord, setChosenWord] = useState<string>("")
    const [correctGuesses, setCorrectGuesses] = useState<number>(0)

    const intervalRef = useRef<number>(null);
    const errorMessageTimeoutRef = useRef<number>(null);
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.NOT_STARTED)
    
    // onStart initializes a new game
    const onStart = () => {
        setGameStatus(GameStatus.IN_PROGRESS)
        setPastGuesses([])
        setCorrectGuesses(0)
        chooseNewWord()
        restartTimer()
    }

    // chooseNewWord chooses a new random word
    const chooseNewWord = () => {
        let newChosenWord = ValidChoiceList[Math.floor(Math.random() * (ValidChoiceList.length + 1))]
        setChosenWord(newChosenWord)
        setCurrentLetters([])
        setLetterStatus(new Map<string, LetterStatus>())
    }

    // restartTimer resets and restarts the timer
    const restartTimer = () => {
        // If we're in the middle of a countdown, clear the interval
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
        }
        setCountdownTime(COUNTDOWN_TIME_SECONDS)

        // Decrement counter every second
        intervalRef.current = setInterval(() => {
            setCountdownTime(countdownTime => {
                if (countdownTime === 0 && intervalRef.current !== null) {
                    clearInterval(intervalRef.current)
                    setGameStatus(GameStatus.OUT_OF_TIME)
                    return 0
                }
                return countdownTime - 1
            })
        }, 1000)
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
            displayError("Not enough letters")
            return
        }
        if (!ValidGuessSet.has(currentLetters.join("").toLowerCase())) {
            displayError("Not in word list")
            return
        }

        let results = makeGuess(currentLetters, chosenWord)
        setCurrentLetters([])

        // Record guess
        let newGuess: Guess = {
            letters: currentLetters,
            results: results
        }
        pastGuesses.push(newGuess)
        setPastGuesses(pastGuesses)

        const isWon = results.every(r => r === LetterStatus.CORRECT)
        if (isWon) {
            // If won, increment correct guesses and choose new word
            setCorrectGuesses(correctGuesses + 1)
            chooseNewWord()
            restartTimer()
        } else {
            // If not won, update the letter status and continue
            currentLetters.forEach((l, i) => {
                if (!letterStatus.has(l)) {
                    letterStatus.set(l, results[i])
                    return
                }
                const oldStatusOrdinal = getLetterStatusOrdinal(letterStatus.get(l) ?? LetterStatus.UNGUESSED)
                const newStatusOrdinal = getLetterStatusOrdinal(results[i])
                if (newStatusOrdinal > oldStatusOrdinal) {
                    letterStatus.set(l, results[i])
                    return
                }
            })
            setLetterStatus(letterStatus)
        }
    }

    const displayError = (errorMessage: string) => {
        setErrorMessage(errorMessage)
        if (errorMessageTimeoutRef.current !== null) {
            clearTimeout(errorMessageTimeoutRef.current)
        }
        errorMessageTimeoutRef.current = setTimeout(() => {
            setErrorMessage(undefined)
        }, ERROR_MESSAGE_SHOW_LENGTH)
    }

    // Cleanup any still running intervals or timeouts
    useEffect(() => {
        return () => {
            if (intervalRef.current != null) {
                clearInterval(intervalRef.current)
            }
            if (errorMessageTimeoutRef.current != null) {
                clearTimeout(errorMessageTimeoutRef.current)
            }
        }
    }, [])

    return (
        <div className="home">
            <h1 className="header">
                <CountdownTimer countdownTime={countdownTime} />
                <Score score={correctGuesses} />
            </h1>
            <div className="gamePanel">
                <WordRowPanel 
                    startingRowCount={5}
                    rowLength={WORD_LENGTH} 
                    currentLetters={currentLetters} 
                    pastGuesses={pastGuesses} 
                    errorMessage={errorMessage}
                />
                <Keyboard 
                    letterStatus={letterStatus} 
                    onKeyPress={onKeyPress} 
                    onEnter={onEnter} 
                    onBackspace={onBackspace}
                    disabled={countdownTime === 0}
                />
            </div>
            {
                gameStatus === GameStatus.NOT_STARTED && (
                    <div className="floatMenu">
                        <div className="floatDialog">
                            <h3>
                                SPEEDLE
                            </h3>
                            <div className="floatDialogDescription">
                                You have <span style={{ color: 'green' }}>{countdownTime}</span> seconds to guess the correct word.
                                Every correct guess resets the time limit and earns a point. When time runs out, it's game over!
                            </div>
                            <button 
                                onClick={() => {
                                    onStart()
                                }}
                                className="startButton"
                            >
                                START
                            </button>
                        </div>
                        
                        <div>
                            
                        </div>
                    </div>
                )
            }
            {
                gameStatus === GameStatus.OUT_OF_TIME && (
                    <div className="floatMenu">
                        <div className="floatDialog">
                            <h3 style={{ color: "red" }}>
                                Game Over
                            </h3>
                            <div className="floatDialogDescription">
                                Correct Word: {chosenWord.toLocaleUpperCase()}
                            </div>
                            <div className="floatDialogDescription">
                                Final Score: {correctGuesses}
                            </div>
                            <button 
                                onClick={() => {
                                    onStart()
                                }}
                                className="startButton"
                            >
                                PLAY AGAIN
                            </button>
                        </div>
                        
                        <div>
                            
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Game