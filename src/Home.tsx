import Game from './components/Game'
import './Home.css'

const numberOfGuesses = 5
const rowLength = 5

const Home = () => {
  return (
    <div>
      <header>
        <span style={{color: "red"}}>(EVIL)</span> WORDLE
      </header>
      <Game />
    </div>
  )
}

export default Home
