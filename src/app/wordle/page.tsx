'use client';
import { StageIcon, WordleBoard, KeyBtn, AlertDropdown, PauseMask } from "@/Components";
import { useWordle } from './useWordle';

export default function Wordle() {
    const { curLevel, levels, keyboard, message, dropdown, score, gamePuase, keyHandler, setDropdown, nextLevel } = useWordle();

    return (
        <div className="bg-slate-800 h-screen w-full fixed flex justify-center items-center">
            <AlertDropdown show={dropdown} message={message} clickHandler={setDropdown} />
            <div className="bg-slate-900 h-auto w-auto px-1 flex flex-col items-center">
                <div className="w-full pt-[.5rem] flex justify-center items-center">
                    <p className="text-[30px] font-bold text-green-500 tracking-widest">{`${score}`}</p>
                </div>
                <div className="flex flex-row justify-center items-center py-[.5rem]">
                    {[...Array(5)].map((_, id)=>(
                        <StageIcon key={id} image={id===curLevel?"/StageHighlightIcon.png":"/StageIcon.png"} />
                    ))}
                </div>
                <div className="w-[33rem] flex items-center overflow-x-hidden">
                    <div className="w-auto flex flex-row items-center 
                                    transition-all duration-500 ease-in-out"
                        style={{ transform: `translateX(${curLevel * -32.2}rem)` }}>
                        {levels.map((level, levelIndex) => (
                            <WordleBoard key={levelIndex} inputs={level} />
                        ))}
                    </div>
                </div>
                <div className="w-full flex flex-col mb-[1rem]">
                    {keyboard.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-row justify-center items-center">
                            {row.map((keyItem, index) => (
                                <KeyBtn key={index} value={keyItem.value} status={keyItem.status} clickHandler={keyHandler} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <PauseMask puase={gamePuase} nextGame={nextLevel} />
        </div>
    );
}
