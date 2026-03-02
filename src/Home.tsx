import Game from './components/Game'
import './Home.css'

const numberOfGuesses = 5
const rowLength = 5
const wordSetSize = 30

const Home = () => {
  return (
    <div>
      <Game numberOfGuesses={numberOfGuesses} rowLength={rowLength} wordSetSize={wordSetSize} />
    </div>
  )
}

export default Home
