import { LetterStatus } from "../types/Types"
import "./Keyboard.css"

type KeyboardProps = {
    letterStatus: Map<string, LetterStatus>;
    onKeyPress: (letter: string, isEnter: boolean, isBackspace: boolean) => any;
    onEnter: () => any;
    onBackspace: () => any;
}

const keyboardLetters: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
const lettersPerRow: number[] = [10, 9, 7]

const Keyboard = (props: KeyboardProps) => {
    let keyCount = 0
    const keyRows: React.ReactElement[] = lettersPerRow.map((count, rowIndex) => {
        let keys: React.ReactElement[] = []
        if (rowIndex === lettersPerRow.length - 1) {
            keys.push(
                <button className="key special-key unguessed-key" onMouseDown={() => props.onEnter()}>
                    ENTER
                </button>
            )
        }
        for (let i = 0; i < count; i++) {
            let l = keyboardLetters[keyCount]
            const status = `${props.letterStatus.get(l)?? LetterStatus.UNGUESSED}-key`
            keys.push(
                <button className={`key ${status}`} onMouseDown={() => props.onKeyPress(l, false, false)}>
                    {l}
                </button>
            )
            keyCount++
        }
        if (rowIndex === lettersPerRow.length - 1) {
            keys.push(
                <button className="key special-key unguessed-key" onMouseDown={() => props.onBackspace()}>
                    🠴
                </button>
            )
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