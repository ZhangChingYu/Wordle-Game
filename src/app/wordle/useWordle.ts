import { useEffect, useState } from "react";
import { fetchRandomWord, fetchValidWordList } from "./wordleService";
import { useSoundEffectFix } from "@/hooks/useSoundEffectFix";
import constants from "@/Constants/wordleConstants.json";
import WORDLE_CONSTANTS from "@/Constants/wordleContants";
import AUDIO_CONSTANTS from "@/Constants/audioConstants";

interface InputData {
    value: string,
    status: string,
    animation: string
}

export function useWordle() {
    const [word, setWord] = useState("TASTE");
    const [validWords, setValidWords] = useState<string[]>([]);
    const jsonStr = JSON.stringify(constants.inputs);
    const [levels, setLevels] = useState<InputData[][][]>([
        JSON.parse(jsonStr),
        JSON.parse(jsonStr),
        JSON.parse(jsonStr),
        JSON.parse(jsonStr),
        JSON.parse(jsonStr)
    ]);
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [enterPressed, setEnterPressed] = useState(false);
    const [keyboard, setKeyboard] = useState<{ value: string, status: string }[][]>([]);

    const [message, setMessage] = useState<string>("");
    const [dropdown, setDropdown] = useState<boolean>(false);

    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameComplete, setGameComplete] = useState<boolean>(false);
    const [gamePuase, setGamePause] = useState<boolean>(false);

    const [score, setScore] = useState<number>(0);
    const [guessCount, setGuessCount] = useState<number>(0);
    const [curLevel, setCurLevel] = useState<number>(0);
    const [pauseDelay, setPauseDelay] = useState<number>(5800);

    const { playSE, stopSE } = useSoundEffectFix();
    const [audioList, setAudioList] = useState<string[]>([AUDIO_CONSTANTS.TYPING]);


    // setup initial data when page load
    useEffect(() => {
        newGame();
        // turn off all playing audio when leave the game
        return () => {
            for(let i = 0 ; i < audioList.length ; i ++) {
                stopSE(audioList[i]);
            }
            setAudioList([]);
        }
    }, []);

    // reset game data
    useEffect(() => {
        // only execute when on level changes but don't repeat this when window reload
        if (!gameComplete && !gameOver && curLevel != 0) {
            init();
        }
    }, [curLevel, gameComplete, gameOver]);

    const init = () => {
        resetGame();
        fetchRandomWord().then(setWord);                                // fetch answer word
        setKeyboard(JSON.parse(JSON.stringify(constants.keyboards)));   // load key items
    }

    // reset game state
    const resetGame = () => {
        setMessage("");
        setDropdown(false);
        setCurCol(0);
        setCurRow(0);
    }

    // next level
    const nextLevel = () => {
        if (curLevel < WORDLE_CONSTANTS.MAX_LEVEL - 1) {
            setGamePause(false);
            setCurLevel(prevLevel => prevLevel + 1);
        } else {
            setGameComplete(true);
        }
    };

    // new game
    const newGame = () => {
        setLevels([
            JSON.parse(jsonStr),
            JSON.parse(jsonStr),
            JSON.parse(jsonStr),
            JSON.parse(jsonStr),
            JSON.parse(jsonStr)
        ]);
        fetchValidWordList().then(setValidWords);   // fetch valid word list
        setScore(0);
        setCurLevel(0);
        setGuessCount(0);
        init();
        setGameComplete(false);
        setGameOver(false);
        setGamePause(false);
    }

    useEffect(() => {}, [levels]);

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
            } else if (e.key === " ") {
                setMessage(word);
                setDropdown(true);
            } else if (e.key === "-") {
                setGameComplete(true);
            }
        };
        window.addEventListener('keydown', keyDownEvent);
        return () => window.removeEventListener('keydown', keyDownEvent);
    }, [keyboard, curRow, curCol, gamePuase, score, enterPressed, dropdown]);

    const keyHandler = function (value: string) {
        playSE(AUDIO_CONSTANTS.TYPING);
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
        if (curCol < WORDLE_CONSTANTS.MAX_COL) {
            shakeAnimationTrigger();
            setMessage("Too Short!");
            setDropdown(true);
        }
        else {
            // concat 5 letters
            const inputWord = levels[curLevel][curRow].map((cell) => cell.value).join("");
            if (checkValidHandler(inputWord)) {
                setGuessCount((pre) => pre + 1);
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
        const tempLevels = [...levels];
        let tempKeyboard = [...keyboard];
        // deep copy
        const tempRow = JSON.parse(JSON.stringify(levels[curLevel][curRow]));
        // check correct
        for (let i = 0; i < tempRow.length; i++) {
            if (tempRow[i].value === target[i]) {
                tempKeyboard = setKeyStatus(tempKeyboard, tempLevels[curLevel][curRow][i].value, "correct");
                target = target.replace(tempRow[i].value, "_");
                tempRow[i].value = "+";
                tempLevels[curLevel][curRow][i].status = "correct";
                matchCount += 1;
            }
        }
        // check exists
        for (let i = 0; i < WORDLE_CONSTANTS.MAX_COL; i++) {
            if (target.includes(tempRow[i].value)) {
                tempKeyboard = setKeyStatus(tempKeyboard, tempLevels[curLevel][curRow][i].value, "exist");
                target = target.replace(tempRow[i].value, "_");
                tempRow[i].value = "+";
                tempLevels[curLevel][curRow][i].status = "exist";
            } else {
                if (tempLevels[curLevel][curRow][i].status === "") {
                    tempKeyboard = setKeyStatus(tempKeyboard, tempLevels[curLevel][curRow][i].value, "incorrect");
                    tempLevels[curLevel][curRow][i].status = "incorrect";
                }
            }
            tempLevels[curLevel][curRow][i].animation = "flip";
        }

        target = word;
        setLevels(tempLevels);
        setKeyboard(tempKeyboard);

        if (matchCount === WORDLE_CONSTANTS.MAX_COL) {

            await handleWin();
        }
        else if (curRow >= WORDLE_CONSTANTS.MAX_ROW - 1) {
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
        // calculate pause delay
        const pDelay = WORDLE_CONSTANTS.WIN_ANIMATION_DELAY
            + WORDLE_CONSTANTS.WIN_HIGHLIGHT_DELAY
            + WORDLE_CONSTANTS.UPDATE_SCORE_DELAY
            + WORDLE_CONSTANTS.FLIP_DELAY * (WORDLE_CONSTANTS.MAX_ROW - curRow);
        setPauseDelay(pDelay);
        setGamePause(true);
        await delay(WORDLE_CONSTANTS.WIN_ANIMATION_DELAY);
        const tempLevels = levels;
        for (let col = 0; col < WORDLE_CONSTANTS.MAX_COL; col++) {
            tempLevels[curLevel][curRow][col].animation = "win";
        }
        setLevels(tempLevels);
        await delay(WORDLE_CONSTANTS.WIN_HIGHLIGHT_DELAY);
        let tempScore = score;
        tempScore += WORDLE_CONSTANTS.LEVEL_SCORE;
        // 1000 point for guessing the answer
        setScore(tempScore);
        // 100 point for each row left
        for (let i = curRow + 1; i < WORDLE_CONSTANTS.MAX_ROW; i++) {
            for (let col = 0; col < WORDLE_CONSTANTS.MAX_COL; col++) {
                tempLevels[curLevel][i][col].animation = "open";
                tempLevels[curLevel][i][col].status = "clear";
            }
            await delay(WORDLE_CONSTANTS.FLIP_DELAY);
            tempScore += WORDLE_CONSTANTS.ROW_REMAINING_SCORE;
            setLevels(tempLevels);
            setScore(tempScore);
        }
        delay(WORDLE_CONSTANTS.UPDATE_SCORE_DELAY);
    }

    const handleLoss = () => {
        setGameOver(true);
        alert(`Game Over! The Answer is: [${word}]`);
    }

    const shakeAnimationTrigger = () => {
        const tempLevels = levels;
        for (let i = 0; i < WORDLE_CONSTANTS.MAX_COL; i++) {
            tempLevels[curLevel][curRow][i].animation = "error";
        }
        setLevels(tempLevels)

        setTimeout(() => {
            for (let i = 0; i < WORDLE_CONSTANTS.MAX_COL; i++) {
                tempLevels[curLevel][curRow][i].animation = "";
            }
            setLevels(tempLevels);
        }, WORDLE_CONSTANTS.ERROR_SHAKE_DURATION);
    }

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


    const deleteInput = () => {
        if (curCol > 0) {
            setLevels((prevLevels) => {
                const newLevels = [...prevLevels];
                newLevels[curLevel][curRow][curCol - 1].value = "";
                return newLevels;
            });
            setCurCol(curCol - 1);
        }
    };

    const addInput = (value: string) => {
        if (curRow < WORDLE_CONSTANTS.MAX_ROW && curCol < WORDLE_CONSTANTS.MAX_COL) {
            setLevels((prevLevels) => {
                const newLevels = [...prevLevels];
                newLevels[curLevel][curRow][curCol].value = value;
                return newLevels;
            });
            setCurCol(curCol + 1);
        }
    };

    const startBGM = () => {
        playSE(AUDIO_CONSTANTS.BGM_1, {loop:true, volume:0.2});
    }

    const stopBGM = () => {
        stopSE(AUDIO_CONSTANTS.BGM_1);
    }

    return { curLevel, levels, keyboard, message, dropdown, score, pauseDelay, gamePuase, gameComplete, gameOver, guessCount, keyHandler, setDropdown, nextLevel, newGame, startBGM, stopBGM };
}


