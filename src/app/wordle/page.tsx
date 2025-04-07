'use client';
import { StageIcon, WordleBoard, KeyBtn, AlertDropdown, PauseMask, GameComplete, Arrow, Setting, SettingBtn } from "@/Components";
import { useWordle } from './useWordle';
import { useState } from "react";

export default function Wordle() {
    const { curLevel, levels, keyboard, message, dropdown, score, 
        pauseDelay, gamePuase, gameComplete, gameOver, guessCount, 
        keyHandler, setDropdown, nextLevel, newGame, startBGM, stopBGM } = useWordle();

    const [openSetting, setOpenSetting] = useState(false);

    const openSettingWindow = () => {
        console.log("open setting window")
        setOpenSetting(true);
    }

    const closeSettingWindow = () => {
        setOpenSetting(false);
    }

    return (
        <div className="bg-slate-800 h-screen w-full fixed flex justify-center items-center">
            <SettingBtn openWindowHandler={openSettingWindow} playBGM={startBGM} stopBGM={stopBGM} />
            <AlertDropdown show={dropdown} message={message} clickHandler={setDropdown} />
            <div className="bg-slate-900 h-auto w-auto px-1 flex flex-col items-center">
                <div className="w-full pt-[.5rem] flex justify-center items-center">
                    <p className="text-[30px] font-bold text-green-500 tracking-widest">{`${score===0?"0000":score}`}</p>
                </div>
                <div className="flex flex-row justify-center items-center pt-[.5rem]">
                    {[...Array(4)].map((_, id)=>(
                        <div key={id} className="flex flex-row items-center">
                            <StageIcon image={id===curLevel?"/StageHighlightIcon.png":"/StageIcon.png"} />
                            <Arrow show={gamePuase&&id===curLevel} />
                        </div>
                    ))}
                    <StageIcon image={4===curLevel?"/StageHighlightIcon.png":"/StageIcon.png"} />
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
            <PauseMask puase={gamePuase} delay={pauseDelay} nextGame={nextLevel} />
            <GameComplete 
                show={gameComplete} 
                title="CONGRATULATIONS!" 
                curLevel={5}
                guessCount={guessCount}
                startNewGame={newGame} 
                score={score} message="WELL PLAYED, DO YOU WANT TO TRY AGAIN OR EXPLORE OTHER GAMES?"/>
            <GameComplete 
                show={gameOver} 
                title="You Loss!" 
                score={score}
                guessCount={guessCount}
                curLevel={curLevel}
                startNewGame={newGame} 
                message="WANNA TRY AGAIN? OR TO TRY OTHER GAMES MAYBE?"/>
            {openSetting?<Setting closeHandler={closeSettingWindow} />:<></>}
        </div>
    );
}
