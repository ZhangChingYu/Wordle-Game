import { Bar, Button } from '@/Components';
import { useNavigation } from '@/hooks/useNavigation';

interface GameOverProps {
    show?: boolean,
    title?: string,
    score?: number,
    guessCount?:number,
    curLevel?:number,
    message?: string,
    startNewGame: ()=>void
}

export default function GameOver({ show = false, title = "", score = 0, guessCount=0, curLevel=0, startNewGame, message = "" }: GameOverProps) {
    const { goHome } = useNavigation();

    const newGameHandler = () => {
        startNewGame();
        console.log("new game");
    }

    const getCorrectRate = () => {
        return Math.floor((5/guessCount)*100);
    }

    return (
        <>
            {show ?
                <div className="absolute w-screen h-screen flex justify-center items-center">
                    <div className="w-[40rem] h-[30rem] bg-slate-800 rounded-3xl 
                        border-4 border-green-400 flex flex-col items-center" >
                        <p className="text-white font-bold text-[36px] py-[2rem]">{title}</p>
                        <div className="w-full h-auto flex flex-row justify-between items-center py-1 px-8">
                            <p className="text-white font-bold text-[24px] pr-[1rem]">SCORE: </p>
                            <Bar totalNum={7500} num={score} barWidth={20} />
                        </div>
                        <div className="w-full h-auto flex flex-row justify-between items-center py-1 px-8">
                            <p className="text-white font-bold text-[24px] pr-[1rem]">CORRECT RATE: </p>
                            <Bar totalNum={100} num={getCorrectRate()} barWidth={20} type='ratio'/>
                        </div>
                        <div className="w-full h-auto flex flex-row justify-between items-center py-1 px-8">
                            <p className="text-white font-bold text-[24px] pr-[1rem]">LEVEL PASS: </p>
                            <Bar totalNum={5} num={curLevel} barWidth={20} />
                        </div>
                        <p className="text-white font-bold text-[22px] px-4 bg-green-400 text-center mt-[10pt]">{message}</p>
                        <div className='w-auto h-full flex flex-row justify-center items-center gap-8'>
                            <Button name='HOME' bg='var(--color-slate-400)' hoverBg='var(--color-slate-300)' shadowBg='var(--color-slate-500)' clickHandler={goHome} />
                            <Button name='NEW GAME' bg='var(--color-amber-400)' hoverBg='var(--color-amber-300)' shadowBg='var(--color-amber-500)' clickHandler={newGameHandler} />
                        </div>
                    </div>
                </div> :
                <></>}
        </>

    )
}