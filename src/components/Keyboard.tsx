import { LetterStatus } from "../types/Types"

type KeyboardProps = {
    disabled?: boolean;
    letterStatus: Map<string, LetterStatus>;
    onKeyPress: (letter: string) => any;
    onEnter: () => any;
    onBackspace: () => any;
}

const keyboardLetters: string[] = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"]
const lettersPerRow: number[] = [10, 9, 7]

const Keyboard = (props: KeyboardProps) => {
    let keyCount = 0
    const keyRows: React.ReactElement[] = lettersPerRow.map((count, rowIndex) => {
        let keys: React.ReactElement[] = []
        if (rowIndex === lettersPerRow.length - 1) {
            keys.push(
                <button disabled={props.disabled} className="key special-key unguessed-key enter-key" onClick={() => props.onEnter()}>
                    ENTER
                </button>
            )
        }
        for (let i = 0; i < count; i++) {
            let l = keyboardLetters[keyCount]
            const status = `${props.letterStatus.get(l)?? LetterStatus.UNGUESSED}-key`
            keys.push(
                <button disabled={props.disabled} className={`key ${status}`} onClick={() => props.onKeyPress(l)}>
                    {l}
                </button>
            )
            keyCount++
        }
        if (rowIndex === lettersPerRow.length - 1) {
            keys.push(
                <button disabled={props.disabled} className="key special-key unguessed-key" onClick={() => props.onBackspace()}>
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