import { LetterStatus } from "./WordRow"
import "./Keyboard.css"

type KeyboardProps = {
    letterStatus: Map<string, LetterStatus>;
}

const keyboardLetters: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
const lettersPerRow: number[] = [10, 9, 7]

const EnterKey = () => {
    return (
        <span className="key special-key unguessed-key">
            ENTER
        </span>
    )
}

const BackspaceKey = () => {
    return (
        <span className="key special-key unguessed-key">
            🠴
        </span>
    )
}

const Keyboard = (props: KeyboardProps) => {
    let keyCount = 0
    const keyRows: React.ReactElement[] = lettersPerRow.map((count, rowIndex) => {
        let keys: React.ReactElement[] = []
        if (rowIndex === lettersPerRow.length - 1) {
            keys.push(<EnterKey />)
        }
        for (let i = 0; i < count; i++) {
            let l = keyboardLetters[keyCount]
            const status = `${props.letterStatus.get(l)?? LetterStatus.UNGUESSED}-key`
            keys.push(
                <span className={`key ${status}`}>
                    {l}
                </span>
            )
            keyCount++
        }
        if (rowIndex === lettersPerRow.length - 1) {
            keys.push(<BackspaceKey />)
        }
        return (
            <div className="keyboardRow">
                {keys}
            </div>
        )
    })

    return (
        <div className="keyboard">
            {keyRows}
        </div>
    )
}

export default Keyboard