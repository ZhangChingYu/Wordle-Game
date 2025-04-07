import Image from "next/image";
import { useState } from "react"

interface SettingBarProps {
    openWindowHandler: () => void,
    playBGM: () => void,
    stopBGM: () => void
}

export default function SettingIcon({ openWindowHandler, playBGM, stopBGM }:SettingBarProps) {
    const [hover, setHover] = useState(false);
    const [click, setClick] = useState(false);
    const [muted, setMuted] = useState(true);

    const toggleBGM = () => {
        if(!muted) {
            stopBGM();
            setMuted(true);
        } else {
            playBGM();
            setMuted(false);
        }
    }

    return (
        <div className="absolute top-[6pt] left-[4pt] flex flex-col items-center justify-center gap-2">
            <div className="w-[40pt] h-[40pt] bg-slate-600 
                rounded-sm cursor-pointer flex justify-center items-center"
                style={{ background: hover ? "var(--color-amber-600)" : "var(--color-slate-600)" }}>
                <div className="absolute -top-[2pt] w-[40pt] h-[40pt] rounded-sm 
                cursor-pointer flex flex-col justify-center items-center gap-[4pt] 
                transition-all ease-in-out"
                    style={click ?
                        { background: "var(--color-amber-400)", transform: "translateY(1pt)" } :
                        hover ?
                            { background: "var(--color-amber-400)", transform: "translateY(-1pt)" } :
                            { background: "var(--color-slate-400)", transform: "translateY(0pt)" }
                    }
                    onMouseEnter={() => { setHover(true) }}
                    onMouseLeave={() => { setHover(false); setClick(false); }}
                    onMouseDown={() => { setClick(true) }}
                    onMouseUp={() => { setClick(false) }}
                    onClick={() => openWindowHandler()} >

                    {[...Array(3)].map((_, id) => (
                        <div key={id} className="w-[30pt] h-[5pt] rounded-full bg-amber-600 rounded-full flex justify-center items-center">
                            <div className="absolute w-[30pt] h-[5pt] rounded-full transition-all ease-in-out"
                                style={click ?
                                    { background: "var(--color-amber-300)", transform: "translateY(-1pt)" } :
                                    hover ?
                                        { background: "var(--color-amber-300)", transform: "translateY(-2pt)" } :
                                        { background: "var(--color-slate-900)", transform: "translateY(0pt)" }
                                }>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center items-center" >
                <Image src={muted?"/Mute.png":"/Audio.png"} alt="Mute" width={56} height={56} className="cursor-pointer" 
                onClick={() => {toggleBGM()}}/>
            </div>
        </div>
    )
}