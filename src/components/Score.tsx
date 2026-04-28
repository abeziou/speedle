import { useEffect, useRef, useState } from "react";
import { INCREASE_SHOW_LENGTH } from "../constants/Constants";

type ScoreProps = {
    score: number;
}

const Score = ({ score }: ScoreProps) => {
    const [showIncrease, setShowIncrease] = useState<boolean>(false)
    const scoreRef = useRef<number>(score)
    const showIncreaseTimeoutRef = useRef<number>(null)

    useEffect(() => {
        if (score > scoreRef.current) {
            if (showIncreaseTimeoutRef.current !== null) {
                clearTimeout(showIncreaseTimeoutRef.current)
            }
            setShowIncrease(true)
            setTimeout(() => {
                setShowIncrease(false)
            }, INCREASE_SHOW_LENGTH)
        }
        scoreRef.current = score
    }, [score])

    return (
        <div className="score">
            {"Score: "} 
            <div className="floatGrid">
                <div style={{ visibility: showIncrease ? "hidden" : "visible" }}>
                    {score}
                </div>
                <div style={{ color: "green", visibility: showIncrease ? "visible" : "hidden" }}>
                    +1
                </div>
            </div>
        </div>
    )
}

export default Score