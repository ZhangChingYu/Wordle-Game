import { useRef, useState } from "react";

export function useSoundEffectFix() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const buffersRef = useRef<{ [key: string]: AudioBuffer }>({});
    // stores the audio references
    const sourcesRef = useRef<{ [key: string]: AudioBufferSourceNode }>({});
    // stores nodes that control each audio volume
    const gainNodesRef = useRef<{ [key: string]: GainNode }>({});
    // the default volume is 50%
    const [volume, setVolume] = useState(0.5);

    // initialize AudioContext
    const initAudioContext = () => {
        if (!audioContextRef.current && typeof window != "undefined") {
            const AudioContextClass = window.AudioContext ||
                (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextClass) {
                console.warn("Server don't support Web Audio API");
                return false;
            }
            audioContextRef.current = new AudioContextClass();
        }
        return true;
    };

    // load mp3 file
    const loadAudio = async (key: string, url: string) => {
        if (buffersRef.current[key]) return;

        if (!audioContextRef.current && !initAudioContext()) {
            return;
        };

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            if (!audioContextRef.current) throw new Error("AudioContext Not Yet Initialized");
            const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            buffersRef.current[key] = audioBuffer;
        } catch (err) {
            console.error(`Failed to load audio [${key}]:`, err);
        }
    };

    // play sound effect
    const playSE = async (key: string, options: { loop?: boolean; volume?: number } = {}) => {
        try {
            if (!buffersRef.current[key]) {
                await loadAudio(key, `/sounds/${key}.mp3`);
            }
            if (!audioContextRef.current) {
                initAudioContext();
            }
            if (!audioContextRef.current || !buffersRef.current[key]) return;
            // stop old audio with the same name
            stopSE(key);

            // create audio source and volume node
            const source = audioContextRef.current!.createBufferSource();
            const gainNode = audioContextRef.current.createGain();

            source.buffer = buffersRef.current[key];
            source.loop = options.loop || false;
            gainNode.gain.value = options.volume !== undefined ? options.volume : volume;

            // connect node: source -> gainNode -> destination
            source.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            source.start(0);

            // store the audio reference
            sourcesRef.current[key] = source;
            gainNodesRef.current[key] = gainNode;
        } catch (err) {
            console.error(`Failed to play audio [${key}]`, err);
        }
    };

    // stop and remove audio 
    const stopSE = (key: string) => {
        const source = sourcesRef.current[key];
        if (source) {
            source.stop();
            delete sourcesRef.current[key];
        }
    };

    // pause all audio
    const pauseAll = () => {
        if (audioContextRef.current) {
            audioContextRef.current.suspend();
        }
    };

    // resume all audio
    const resumeAll = () => {
        if (audioContextRef.current) {
            audioContextRef.current.resume();
        }
    };

    // global volume setting
    const setGlobalVolume = (newVolume: number) => {
        setVolume(newVolume);
        Object.values(gainNodesRef.current).forEach((gainNode) => {
            gainNode.gain.value = newVolume;
        });
    };

    // single volume setting
    const setVolumeForSE = (key: string, newVolume: number) => {
        const gainNode = gainNodesRef.current[key];
        if (gainNode) {
            gainNode.gain.value = newVolume;
        }
    };

    return { playSE, stopSE, pauseAll, resumeAll, volume, setGlobalVolume, setVolumeForSE };
}