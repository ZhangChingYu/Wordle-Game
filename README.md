# Worldle Game (Next.js + Typescript + Tailwindcss)
Project Description...

## Game Rules
- Guess the word: 1000
- Chances left: 100 per chance

## Project Directory
```t
wordle-game/
├── src/app                         # Web page contents
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Global settings
│   ├── api/                        # API Routes (to store user scores in the future)
│   ├── wordle/                     # Wordle Page
│       ├── page.tsx                # Wordle UI
│       ├── useWordle.ts            # Wordle Logics and State Management, (scalable)
│       ├── wordleService.ts        # Handle API requests, (reusable)
├── public/                         # Static resources (images, favicon)
├── package.json                    # dependencies and scripts
```

## Sound Effects
When I try to implement sound effects in this project, I've encountered some issues. There's a problem with the audio playing on Safari browser due to it's restrictions on audio playing. Here are the original methods I try to implement music playing, and how I manage to solve this problem:

### Oringinal Plan A: HTMLAudioElement
``` javascript
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
            audio.load();   // manually load try to fix Safari problem
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
```

### Original Plan B: <audio>
```javascript
"use client";
import { useRef } from "react";

export default function Page() {
  const typingRef = useRef<HTMLAudioElement|null>(null);

  const handlePlayTyping = async () => {
    const audio = typingRef.current;
    if(!audio) return;
    console.log(audio);
    // try to mute and unmute (still failed on Safari)
    audio.muted = true;
    try {
      await audio.play();
      audio.muted = false;
    } catch (err) {
      console.error("Fallback to unmuted play:", err);
      audio.muted = false;
      await audio.play();
    }
    if(audio) {
      audio.currentTime = 0;
      audio.play().catch(err => console.error("Fail Play", err));
    }
  };

  return (
    <div>
        <button onClick={handlePlayTyping}> click to play
          <audio ref={typingRef} src="/sounds/typing.mp3" preload="auto" />
        </button>
      </div>
    </div>
  );
}
```

### Solution: AudioContext
Here is how I managed to solve the audio playing issues on Safari browser by using `AudioContext`. However, **Plan A** and **Plan B** still work fine on Chrome browser.

- **User gesture restrictions:** Safari requires that the `AudioContext` must be created after user interaction (such as a click).
- **Compatibility:** Older versions of Safari use `webkitAudioContext` instead of the standard `AudioContext`.
- **Resource preloading:** Explicitly load audio files via `fetch` + `decodeAudioData` to avoid Safari's preloading issues.

```javascript
import { useRef } from "react";

export function useSoundEffectFix() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const buffersRef = useRef<{ [key: string]: AudioBuffer }>({});

    // initialize AudioContext
    const initAudioContext = () => {
        if (!audioContextRef.current && typeof window != "undefined") {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if(!AudioContextClass) {
                console.error("Server don't support Web Audio API");
                return;
            }
            audioContextRef.current = new AudioContextClass();
            
        }
    };

    // load mp3 file
    const loadAudio = async (key: string, url: string) => {
        if (!audioContextRef.current) {
            initAudioContext();
            if(!audioContextRef.current) {
                throw new Error("AudioContext Initializing Failure");
            }
        };
        if (buffersRef.current[key]) return;

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            if(audioContextRef.current) {
                const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
                buffersRef.current[key] = audioBuffer;
            }
        } catch (err) {
            console.error(`Failed to load audio [${key}]:`, err);
        }
    };

    // play sound effect
    const playSEFix = async (key: string) => {
        try {
            if (!buffersRef.current[key]) {
                await loadAudio(key, `/sounds/${key}.mp3`);
            }
            const source = audioContextRef.current!.createBufferSource();
            source.buffer = buffersRef.current[key];
            source.connect(audioContextRef.current!.destination);
            source.start(0);
        } catch (err) {
            console.error(`Failed to play audio [${key}]`, err);
        }
    };
    return {playSEFix}
}
```