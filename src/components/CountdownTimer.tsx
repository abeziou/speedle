import { useEffect, useRef, useState } from "react";
import { INCREASE_SHOW_LENGTH } from "../constants/Constants";

type CountdownTimerProps = {
    countdownTime: number; // seconds in countdown
}

const CountdownTimer = ({ countdownTime }: CountdownTimerProps) => {
    const [showIncrease, setShowIncrease] = useState<boolean>(false)
    const countdownTimeRef = useRef<number>(countdownTime)
    const showIncreaseTimeoutRef = useRef<number>(null)

    useEffect(() => {
        if (countdownTime > countdownTimeRef.current) {
            if (showIncreaseTimeoutRef.current !== null) {
                clearTimeout(showIncreaseTimeoutRef.current)
            }
            setShowIncrease(true)
            setTimeout(() => {
                setShowIncrease(false)
            }, INCREASE_SHOW_LENGTH)
        }
        countdownTimeRef.current = countdownTime
    }, [countdownTime])

    return (
        <div style={{ color: showIncrease ? "green" : "black" }}>
            {Math.floor(countdownTime / 60)}:{(countdownTime % 60).toLocaleString('en-US', { 
                minimumIntegerDigits: 2, 
                useGrouping: false 
            })}
        </div>
    )
}

export default CountdownTimer