import { useEffect } from "react"

interface MaskProps {
    puase:boolean,
    delay:number,
    nextGame:()=>void
}

export default function PauseMask({puase, delay, nextGame}:MaskProps) {
    useEffect(() => {
        setTimeout(() => {
            if(puase) {
                nextGame();
                console.log("next game go")
            }
        }, delay);
    }, [puase])
    return (
        <div className="">
            {puase?
            <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
                
            </div>:<></>}
        </div>
    )
}