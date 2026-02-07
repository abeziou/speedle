import WordRow, { LetterStatus } from './components/WordRow'
import './Home.css'

const Home = () => {
  let letterStatus: LetterStatus[] = [LetterStatus.CORRECT, LetterStatus.NOT_IN_WORD, LetterStatus.OUT_OF_POSITION]
  let letters: string[] = ["T", "e", "s", "t"]
  return (
    <div>
      <header>
        EVIL WORDLE
      </header>
      <WordRow length={5} letters={letters} results={letterStatus} />
    </div>
  )
}

export default Home
