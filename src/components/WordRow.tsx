import "./WordRow.css"
import { LetterStatus } from "../types/Types"

type WordRowProps = {
    length: number;
    letters: string[];
    results: LetterStatus[];
}

const WordRow = (props: WordRowProps) => {
    let letterBoxes: React.ReactElement[] = []
    for (let i = 0; i < props.length; i++) {
        const letter = props.letters && i < props.letters.length ? props.letters[i].toUpperCase() : ""
        let letterStatus =  "unfilled"
        if (props.results && i < props.results.length) {
            letterStatus = `${props.results[i]} guessed`
        } else if (letter !== "") {
            letterStatus = LetterStatus.UNGUESSED
        }
        letterBoxes.push(
            <span className={`letterbox ${letterStatus}`}>
                {letter}
            </span>    
        )
    }
    return (
        <div className="wordrow">
            {letterBoxes}
        </div>
    )
}

export default WordRow