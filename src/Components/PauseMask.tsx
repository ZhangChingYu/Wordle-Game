interface MaskProps {
    puase:boolean,
    nextGame:()=>void
}

export default function PauseMask({puase, nextGame}:MaskProps) {
    return (
        <div className="">
            {puase?
            <div className="fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
                <div className="w-auto h-auto px-[4rem] py-[2rem] bg-slate-500" onClick={()=>nextGame()}>Next Game</div>
            </div>:<></>}
        </div>
    )
}