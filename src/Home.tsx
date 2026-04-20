import { useState } from 'react'
import { type GameSettings } from './types/Types' 
import Game from './components/Game'

const getDefaultSettings = () => {
    let defaultSettings: GameSettings = {
        numberOfGuesses: 6,
        wordSetSize: 30,
        isEvil: false
    }
    return defaultSettings
}

const Home = () => {
  const [settings, setSettings] = useState(getDefaultSettings())

  return (
    <div className="home">
      <h1 className="header">
        <span style={{color: settings.isEvil ? "red" : "green"}}>({settings.isEvil ? "EVIL" : "GOOD"})</span> WORDLE
      </h1>
      <Game settings={settings}/>
    </div>
  )
}

export default Home
