import { StageIcon, WordleSquare, KeyBtn } from "@/Components";
import constants from '@/Constants/wordleConstants.json';

export default function Wordle() {
    return (
        <div className="bg-slate-800 h-screen w-full fixed flex justify-center items-center">
            <div className="bg-slate-900 h-auto w-auto px-1 flex flex-col">
                <div className="flex flex-row justify-center items-center py-[1rem]">
                    <StageIcon image="/StageDoneIcon.png" />
                    <StageIcon image="/StageHighlightIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                    <StageIcon image="/StageIcon.png" />
                </div>
                <div className="w-full py-[1rem]">
                    <div className="w-full h-auto flex flex-col justify-center">
                        <div className="flex flex-row justify-center items-center pt-[1rem]">
                            <WordleSquare status="correct" value="S"/>
                            <WordleSquare status="incorrect" value="W"/>
                            <WordleSquare status="exist" value="T"/>
                            <WordleSquare value="K" />
                            <WordleSquare />
                        </div>
                        <div className="flex flex-row justify-center items-center pt-[.4rem]">
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                        </div>
                        <div className="flex flex-row justify-center items-center pt-[.4rem]">
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                        </div>
                        <div className="flex flex-row justify-center items-center pt-[.4rem]">
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                        </div>
                        <div className="flex flex-row justify-center items-center pt-[.4rem]">
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                        </div>
                        <div className="flex flex-row justify-center items-center pt-[.4rem]">
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                            <WordleSquare />
                        </div>    
                    </div>
                </div>
                <div className="w-full flex flex-col mb-[1rem]">
                    {constants.keyboards.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex flex-row justify-center items-center">
                            {row.map((value, index) => (
                                <KeyBtn key={index} value={value}/>
                            ))}
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    );
}
