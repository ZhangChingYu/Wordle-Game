import { useEffect, useState } from "react";
import { fetchRandomWord, fetchValidWordList } from "./wordleService";
import constants from "@/Constants/wordleConstants.json";

export function useWordle() {
    const [word, setWord] = useState("TASTE");
    const [validWords, setValidWords] = useState<string[]>([]);
    const [inputs, setInputs] = useState<({
        value: string;
        status: string;
        animation: string;
    } | {
        value: string;
        status: string;
        animation?: undefined;
    })[][]>([]);
    const [levels, setLevels] = useState([
        JSON.parse(JSON.stringify(constants.inputs)),
        JSON.parse(JSON.stringify(constants.inputs)),
        JSON.parse(JSON.stringify(constants.inputs)),
        JSON.parse(JSON.stringify(constants.inputs)),
        JSON.parse(JSON.stringify(constants.inputs))
    ]);
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [enterPressed, setEnterPressed] = useState(false);
    const [keyboard, setKeyboard] = useState<{ value: string, status: string }[][]>([]);

    const [message, setMessage] = useState<string>("");
    const [dropdown, setDropdown] = useState<boolean>(false);

    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gamePuase, setGamePause] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [curLevel, setCurLevel] = useState(0);

    // load initial data
    useEffect(() => {
        if(gameOver) {
            setLevels([]);
        }
        fetchValidWordList().then(setValidWords);   // fetch valid word list
        setInputs(levels[0]);
        setCurLevel(0);
    }, [gameOver])

    // reset game data
    useEffect(() => {
        init();
    }, [curLevel]);

    const init = () => {
        resetGame();
        fetchRandomWord().then(setWord);                                // fetch answer word
        setKeyboard(JSON.parse(JSON.stringify(constants.keyboards)));   // load key items
        setInputs(levels[curLevel]);
        console.log(inputs);
    }

    // reset game state
    const resetGame = () => {
        setGamePause(false);
        setMessage("");
        setCurCol(0);
        setCurRow(0);
        setDropdown(false);
    }

    // next game
    const nextLevel = () => {
        if(curLevel < 4) {
            setCurLevel(prevLevel => prevLevel + 1);
        } else {
            alert("You Win Game Over");
        }
    };

    // keydown event listener
    useEffect(() => {
        const keyDownEvent = (e: KeyboardEvent) => {
            const isLetter = /^[a-zA-Z]$/.test(e.key);
            if (e.key === "Enter") {
                keyHandler("ENTER");
            } else if (e.key === "Backspace") {
                keyHandler("DELETE");
            } else if (isLetter) {
                keyHandler(e.key.toUpperCase());
            } else if(e.key === " ") {
                setMessage(word);
                setDropdown(true);
            }
        };
        window.addEventListener('keydown', keyDownEvent);
        return () => window.removeEventListener('keydown', keyDownEvent);
    }, [inputs, keyboard, curRow, curCol, gamePuase, score, enterPressed, dropdown]);

    const keyHandler = function (value: string) {
        if (gamePuase) {
            return;
        }
        if (value === 'ENTER') {
            setEnterPressed(!enterPressed);
            checkSpellHandler();
        } else if (value === 'DELETE') {
            deleteInput();
        } else {
            addInput(value);
        }
    }

    const checkSpellHandler = () => {
        if (curCol <= 4) {
            shakeAnimationTrigger();
            setMessage("Too Short!");
            setDropdown(true);
        }
        else {
            // concat 5 letters
            const inputWord = inputs[curRow].map((cell) => cell.value).join("");
            if (checkValidHandler(inputWord)) {
                processWordMatch();
            } else {
                shakeAnimationTrigger();
                setMessage(`${inputWord} is not a word!`);
                setDropdown(true);
            }
        }
    }

    const checkValidHandler = (word: string) => {
        let isValid = false;
        const target = word.toLowerCase();
        if (validWords.includes(target)) {
            isValid = true;
        }
        return isValid;
    }

    const processWordMatch = async () => {
        let target = word;
        let matchCount = 0;
        const tempInputs = [...inputs];
        let tempKeyboard = [...keyboard];
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
                if (tempInputs[curRow][i].status === "") {
                    tempKeyboard = setKeyStatus(tempKeyboard, tempInputs[curRow][i].value, "incorrect");
                    tempInputs[curRow][i].status = "incorrect";
                }
            }
            tempInputs[curRow][i].animation = "flip";
        }

        target = word;
        setInputs(tempInputs);
        setKeyboard(tempKeyboard);

        if (matchCount === 5) {
            await handleWin();
        }
        else if (curRow >= 5) {
            handleLoss();
        } else {
            setCurCol(0);
            setCurRow(curRow + 1);
        }

        function setKeyStatus(keyboard: { value: string, status: string }[][], letter: string, status: string) {
            const newKeyboard = keyboard;
            for (let row = 0; row < newKeyboard?.length; row++) {
                for (let col = 0; col < newKeyboard[row].length; col++) {
                    if (newKeyboard[row][col].value === letter) {
                        if (status === "correct") {
                            newKeyboard[row][col].status = status;
                        } else if (status === "exist") {
                            newKeyboard[row][col].status = newKeyboard[row][col].status != "correct" ? status : "correct";
                        } else if (newKeyboard[row][col].status === "") {
                            newKeyboard[row][col].status = status;
                        }
                    }
                }
            }
            return newKeyboard;
        }
    }

    const handleWin = async () => {
        setGamePause(true);

        let tempScore = score;
        tempScore += 1000;
        // 1000 point for guessing the answer
        setScore(tempScore);
        // 100 point for each row left
        for (let i = curRow; i < 5; i++) {
            await delay(500);
            tempScore += 100;
            setScore(tempScore);
        }
        delay(100);
        setMessage("You Win!");
        setDropdown(true);
    }

    const handleLoss = () => {
        setGameOver(true);
        alert(`Game Over! The Answer is: [${word}]`);
    }

    const shakeAnimationTrigger = () => {
        const tempInputs = inputs;
        for (let i = 0; i < 5; i++) {
            tempInputs[curRow][i].animation = "error";
        }
        setInputs(tempInputs);

        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                tempInputs[curRow][i].animation = "";
            }
            setInputs(tempInputs);
        }, 500);
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


    const deleteInput = () => {
        if (curCol > 0) {
            setInputs((prevInputs) => {
                const newInputs = [...prevInputs];
                newInputs[curRow][curCol - 1].value = "";
                return newInputs;
            });
            setCurCol(curCol - 1);
        }
    };

    const addInput = (value: string) => {
        if (curRow < 6 && curCol < 5) {
            setInputs((prevInputs) => {
                const newInputs = [...prevInputs];
                newInputs[curRow][curCol].value = value;
                return newInputs;
            });
            setCurCol(curCol + 1);
        }
    };

    return { inputs, curLevel, levels, keyboard, message, dropdown, score, gamePuase, keyHandler, setDropdown, nextLevel };
}


