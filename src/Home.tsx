import Keyboard from './components/Keyboard'
import WordRow, { LetterStatus } from './components/WordRow'
import './Home.css'

const Home = () => {
  let pastGuesses: string[][] = []
  let pastResults: LetterStatus[][] = []
  let currentLetters: string[] = []
  return (
    <div>
      <header>
        <span style={{color: "red"}}>(EVIL)</span> WORDLE
      </header>
      <WordRow length={5} letters={currentLetters} results={[]}/>
      <Keyboard letterStatus={new Map<string, LetterStatus>()} />
    </div>
  )
}

export default Home
