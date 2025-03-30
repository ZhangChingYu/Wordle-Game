import { useEffect, useState } from "react";
import { fetchRandomWord, fetchValidWordList } from "./wordleService";
import constants from "@/Constants/wordleConstants.json";

export function useWordle() {
    const [word, setWord] = useState("TASTE");
    const [validWords, setValidWords] = useState<string[]>([]);
    const [inputs, setInputs] = useState(constants.inputs);
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [keyboard, setKeyboard] = useState<{value:string, status:string}[][]>([]);

    // fetch answer word
    useEffect(() => {
        fetchRandomWord().then(setWord);
    }, []);

    // fetch valid word list
    useEffect(() => {
        fetchValidWordList().then(setValidWords);
    }, []);

    // load key items
    useEffect(() => {
        setKeyboard(constants.keyboards);
    }, []);

    // keydown event listener
    useEffect(() => {
        const keyDownEvent = (e:KeyboardEvent) => {
            const isLetter = /^[a-zA-Z]$/.test(e.key);
            if(e.key === "Enter") {
                keyHandler("ENTER");
            } else if (e.key === "Backspace") {
                keyHandler("DELETE");
            } else if(isLetter){
                keyHandler(e.key.toUpperCase());
            }
        };
        window.addEventListener('keydown', keyDownEvent);
        return () => window.removeEventListener('keydown', keyDownEvent);
    }, [inputs, keyboard, curRow, curCol, gameOver]);

    const keyHandler = function (value: string) {
        if(gameOver) {
            return;
        }
        if (value === 'ENTER') {
            checkSpellHandler();
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

    const checkSpellHandler = () => {
        if (curCol <= 4) {
            alert("Not enough letters!");
        }
        else if (curCol === 5) {
            const inputWord = inputs[curRow][0].value+inputs[curRow][1].value+inputs[curRow][2].value+inputs[curRow][3].value+inputs[curRow][4].value;
            if(checkValidHandler(inputWord)) {
                wordMatchHandler();
            } else {
                alert(`${inputWord} is not a word!`);
            }
        }
    }

    const checkValidHandler = (word:string) => {
        let isValid = false;
        const target = word.toLowerCase();
        if(validWords.includes(target)) {
            isValid = true;
        }
        return isValid;
    }

    const wordMatchHandler = () => {
        let target = word;
        let matchCount = 0;
        let tempKeyboard = keyboard;
        const tempInputs = inputs;
        // deep copy
        const tempRow = JSON.parse(JSON.stringify(inputs[curRow]));
        // check correct
        for (let i = 0; i < tempRow.length; i++) {
            if (tempRow[i].value === target[i]) {
                tempKeyboard = setKeyStatus(tempKeyboard, tempInputs[curRow][i].value, "correct");
                target = target.replace(tempRow[i].value, "_");
                tempRow[i].value = "+";
                tempInputs[curRow][i].status = "correct";
                matchCount += 1;
            }
        }
        // check exists
        for (let i = 0; i < 5; i++) {
            if (target.includes(tempRow[i].value)) {
                tempKeyboard = setKeyStatus(tempKeyboard, tempInputs[curRow][i].value, "exist");
                target = target.replace(tempRow[i].value, "_");
                tempRow[i].value = "+";
                tempInputs[curRow][i].status = "exist";
            } else {
                if(tempInputs[curRow][i].status==="") {
                    tempKeyboard = setKeyStatus(tempKeyboard, tempInputs[curRow][i].value, "incorrect");
                    tempInputs[curRow][i].status ="incorrect";
                }
            }
        }
        target = word;
        setInputs(tempInputs);
        setKeyboard(tempKeyboard);
        if(matchCount === 5) {
            setGameOver(true);
            alert("You Win!");
        }
        else if (curRow >= 5) {
            setGameOver(true);
            alert(`Game Over! The Answer is: [${word}]`);
        } else {
            setCurCol(0);
            setCurRow(curRow + 1);
        }

        function setKeyStatus(keyboard:{value:string, status:string}[][], letter:string, status: string){
            console.log(word);
            const newKeyboard = keyboard;
            for(let row = 0 ; row < newKeyboard?.length ; row ++) {
                for(let col = 0 ; col < newKeyboard[row].length ; col ++) {
                    if(newKeyboard[row][col].value === letter){
                        console.log("get key: ", newKeyboard[row][col].value, letter, status);
                        if(status === "correct"){
                            newKeyboard[row][col].status = status;
                        } else if (status === "exist"){
                            newKeyboard[row][col].status = newKeyboard[row][col].status != "correct" ? status:"correct";
                        } else if(newKeyboard[row][col].status === "") {
                            newKeyboard[row][col].status = status;
                        }
                        console.log(newKeyboard[row][col].status);
                    }
                }
            }
            return newKeyboard;
        }
    }

    return { inputs, keyboard, keyHandler };
}

