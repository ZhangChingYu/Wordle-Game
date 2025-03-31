interface GameOverProps {
    title?:string,
    score?:string,
    message?:string
}

export default function GameOver({title, score, message}:GameOverProps) {
    return (
        <div className="absolute w-screen h-screen flex justify-center items-center">
            {title}{score}{message}
        </div>
    )
}