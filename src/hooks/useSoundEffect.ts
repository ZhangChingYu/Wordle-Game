import { useRef } from "react";

export function useSoundEffect() {
    const sounds = useRef<{ [key: string]: HTMLAudioElement }>({});

    const setUpAudio = (key: string) => {
        if (!sounds.current[key]) {
            const srcMap: { [key: string]: string } = {
                typing: "/sounds/typing.mp3",
                bgm1: "/sounds/bgm1.mp3"
            };
            const audio = new Audio(srcMap[key]);
            if (key.startsWith("bgm")) {
                audio.loop = true;
            }
            audio.load();   // this is for Safari
            sounds.current[key] = audio;
        }
    }

    const playSE = (key: string) => {
        try {
            setUpAudio(key);
            const sound = sounds.current[key];
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch((err) => {
                    console.error(`Audio play error [${key}]:`, err);
                });
            }
        } catch (e) {
            console.error(`Unexpected audio error [${key}]`, e);
        }
        
    };

    const stopSE = (key: string) => {
        const sound = sounds.current[key];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    };

    return { playSE, stopSE };
}