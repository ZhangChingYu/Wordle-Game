import { useEffect } from "react"

interface MaskProps {
    puase:boolean,
    nextGame:()=>void
}

export default function PauseMask({puase, nextGame}:MaskProps) {
    useEffect(() => {
        setTimeout(() => {
            if(puase) {
                nextGame();
                console.log("next game go")
            }
        }, 2200);
    }, [puase])
    return (
        <div className="">
            {puase?
            <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
                
            </div>:<></>}
        </div>
    )
}