import type { LetterStatus } from "../types/Types";
import type { Guess } from "../types/Types";
import WordRow from "./WordRow";

type WordRowPanelProps = {
    rowCount: number;
    rowLength: number;
    currentLetters: string[];
    pastGuesses: Guess[];
}

const WordRowPanel = (props: WordRowPanelProps) => {
    let wordRows: React.ReactElement[] = []
    for (let i = 0; i < props.rowCount; i++) {
        let letters: string[] = []
        let results: LetterStatus[] = []
        if (i < props.pastGuesses.length) {
            letters = props.pastGuesses[i].letters
            results = props.pastGuesses[i].results
        } else if (i === props.pastGuesses.length) {
            letters = props.currentLetters
        }
        wordRows.push(<WordRow length={props.rowLength} letters={letters} results={results}/>)
    }

    return <div className="wordrowpanel">{wordRows}</div>
}

export default WordRowPanel