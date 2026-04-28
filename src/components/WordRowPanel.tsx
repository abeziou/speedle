import type { Guess } from "../types/Types";
import WordRow from "./WordRow";

type WordRowPanelProps = {
    startingRowCount: number;
    rowLength: number;
    currentLetters: string[];
    pastGuesses: Guess[];
    errorMessage?: string;
}

const WordRowPanel = (props: WordRowPanelProps) => {
    let wordRows: React.ReactElement[] = []
    for (let i = props.pastGuesses.length - 1; i >= 0; i--) {
        wordRows.push(
            <WordRow 
                length={props.rowLength} 
                letters={props.pastGuesses[i].letters} 
                results={props.pastGuesses[i].results} 
            />
        )
    }
    for (let i = wordRows.length; i < props.startingRowCount; i++) {
        wordRows.push(
            <WordRow 
                length={props.rowLength} 
                letters={[]} 
                results={[]} 
                isGhostRow
            />
        )
    }

    return (
        <div className="wordRowPanel">
            <WordRow 
                length={props.rowLength} 
                letters={props.currentLetters} 
                errorMessage={props.errorMessage}
                isCurrentRow 
            />
            <div style={{ marginBottom: '0.5rem' }} />
            <div style={{ 
                overflowY: 'scroll', 
                height: `calc(var(--letterbox-width) * ${props.startingRowCount})`,
                paddingLeft: '1rem',
                paddingRight: '1rem', 
            }}>
                {wordRows}
            </div>
        </div>
    )
}

export default WordRowPanel