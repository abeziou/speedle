import { useEffect, useState } from "react";
import { LetterStatus } from "../types/Types"

type WordRowProps = {
    length: number;
    letters: string[];
    results?: LetterStatus[];
    errorMessage?: string;
    isCurrentRow?: boolean;
    isGhostRow?: boolean;
}

const WordRow = (props: WordRowProps) => {
    const [showWobble, setShowWobble] = useState(false)

    let letterBoxes: React.ReactElement[] = []
    for (let i = 0; i < props.length; i++) {
        const letter = props.letters && i < props.letters.length ? props.letters[i].toUpperCase() : ""
        let letterStatus =  "unfilled"
        if (props.isGhostRow) {
            letterStatus = "ghost"
        } else if (props.results && i < props.results.length) {
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
    
    useEffect(() => {
        if (props.errorMessage) {
            setShowWobble(true)
        } else {
            setShowWobble(false)
        }
    }, [props.errorMessage])

    return (
        <div className="floatGrid">
            <div className={"wordRow "  + (showWobble ? "wobble" : "")} id={props.isCurrentRow ? "currentLetterRow": undefined}>
                {letterBoxes}
            </div>
            <div className="errorMessage" style={{ display: props.errorMessage ? "flex" : "none" }}>
                {props.errorMessage?.toLocaleUpperCase()}
            </div>
        </div>
        
    )
}

export default WordRow