'use client';
import { StageIcon, WordleSquare, KeyBtn } from "@/Components";
import constants from '@/Constants/wordleConstants.json';
import { useState } from "react";

export default function Wordle() {
    const word = "TASTE";

    const [inputs, setInputs] = useState(constants.inputs);
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);

    const checkSpellHandler = () => {
        let target = word;
        const tempInputs = inputs;
        // deep copy
        const tempRow = JSON.parse(JSON.stringify(inputs[curRow])); 
        // check correct
        for(let i = 0 ; i < tempRow.length ; i ++) {
            if(tempRow[i].value === target[i]) {
                target = target.replace(tempRow[i].value, "_");
                tempRow[i].value = "+";
                tempInputs[curRow][i].status = "correct";
                console.log(target);
            }
        }
        // check exists
        for(let i = 0 ; i < 5 ; i ++) {
            if(target.includes(tempRow[i].value)) {
                target = target.replace(tempRow[i].value, "_");
                tempRow[i].value = "+";
                tempInputs[curRow][i].status = "exist";
            }
        }
        target = word;
        setInputs(tempInputs);
        setCurCol(0);
        if (curRow < 5) {
            setCurRow(curRow + 1);
        }
    }

    const keyHandler = function (value: string) {
        if (value === 'ENTER') {
            if (curCol <= 4) {
                alert("Not enough letters!");
            }
            else if (curCol === 5) {
                checkSpellHandler()
            }
        } else if (value === 'DELETE') {
            const tempInputs = constants.inputs;
            if (curCol > 0) {
                tempInputs[curRow][curCol - 1].value = "";
                setInputs(tempInputs);
                setCurCol(curCol - 1);
            }

        } else {
            if (curRow < 6 && curCol < 5) {
                const tempInputs = constants.inputs;
                tempInputs[curRow][curCol].value = value;
                setInputs(tempInputs);
                setCurCol(curCol + 1);
            }
        }
    }

    return (
        <div className="bg-slate-800 h-screen w-full fixed flex justify-center items-center">
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
                            <div key={rowIndex} className="flex flex-row justify-center items-center pt-[1rem]">
                                {row.map((item, colIndex) => (
                                    <WordleSquare 
                                    key={colIndex} 
                                    value={item.value} 
                                    status={item.status}/>
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
