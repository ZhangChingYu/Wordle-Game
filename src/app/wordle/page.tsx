'use client';
import { StageIcon, WordleBoard, KeyBtn, AlertDropdown, PauseMask } from "@/Components";
import { useWordle } from './useWordle';

export default function Wordle() {
    const { inputs, keyboard, message, dropdown, score, gameOver, keyHandler, setDropdown, nextLevel } = useWordle();

    return (
        <div className="bg-slate-800 h-screen w-full fixed flex justify-center items-center">
            <AlertDropdown show={dropdown} message={message} clickHandler={setDropdown} />
            <div className="bg-slate-900 h-auto w-auto px-1 flex flex-col">
                <div className="w-full pt-[.5rem] flex justify-center items-center">
                    <p className="text-[30px] font-bold text-green-500 tracking-widest">{score}</p>
                </div>
                <div className="flex flex-row justify-center items-center py-[.5rem]">
                    <StageIcon image="/StageHighlightIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                </div>
                <WordleBoard inputs={inputs} />
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
            <PauseMask puase={gameOver} nextGame={nextLevel}/>
        </div>
    );
}
