'use client';
import { StageIcon, WordleSquare, KeyBtn } from "@/Components";
import constants from '@/Constants/wordleConstants.json';
import { useWordle } from './useWordle';

export default function Wordle() {
    const { inputs, keyHandler } = useWordle();

    return (
        <div className="bg-slate-800 h-screen w-full fixed flex justify-center items-center overflow-scroll">
            <div className="bg-slate-900 h-auto w-auto px-1 flex flex-col">
                <div className="w-full pt-[.5rem] flex justify-center items-center">
                    <p className="text-[30px] font-bold text-white tracking-widest">0000</p>
                </div>
                <div className="flex flex-row justify-center items-center py-[.5rem]">
                    <StageIcon image="/StageHighlightIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                </div>
                <div className="w-full py-[1rem]">
                    <div className="w-full h-auto flex flex-col justify-center">
                        {inputs.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex flex-row justify-center items-center pt-[.5rem]">
                                {row.map((item, colIndex) => (
                                    <WordleSquare
                                        key={colIndex}
                                        value={item.value}
                                        status={item.status} />
                                ))}
                            </div>
                        ))}

                    </div>
                </div>
                <div className="w-full flex flex-col mb-[1rem]">
                    {constants.keyboards.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-row justify-center items-center">
                            {row.map((value, index) => (
                                <KeyBtn key={index} value={value} clickHandler={keyHandler} />
                            ))}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
