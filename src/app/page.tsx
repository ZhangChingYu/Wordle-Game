"use client";
import Link from "next/link";
import { useSoundEffectFix } from "@/hooks/useSoundEffectFix";

export default function Page() {
  const { playSE, stopSE } = useSoundEffectFix();
  const handleSEFixPlay = (key: string) => {
    console.log(`Play SE [${key}]`);
    playSE(key);
  }

  const handleBGMPlay = (key:string) => {
    console.log(`Play BGM ${key}`);
    playSE(key, {loop:true});
  }

  const handleBGMStop = (key:string) => {
    console.log(`Stop BGM ${key}`);
    stopSE(key);
  }

  return (
    <div>
      <Link href="/wordle">Go Game</Link>
      <div className="cursor-pointer" onClick={() => handleSEFixPlay("typing")} >Play SE Fix</div>
      <div className="cursor-pointer" onClick={() => handleBGMPlay("bgm1")}>Play BGM1</div>
      <div className="cursor-pointer" onClick={() => handleBGMStop("bgm1")}>Stop BGM1</div>
      <div className="cursor-pointer" onClick={() => handleBGMPlay("bgm2")}>Play BGM2</div>
      <div className="cursor-pointer" onClick={() => handleBGMStop("bgm2")}>Stop BGM2</div>
      <div className="cursor-pointer" onClick={() => handleBGMPlay("bgm3")}>Play BGM3</div>
      <div className="cursor-pointer" onClick={() => handleBGMStop("bgm3")}>Stop BGM3</div>
      <div className="cursor-pointer" onClick={() => handleBGMPlay("bgm4")}>Play BGM4</div>
      <div className="cursor-pointer" onClick={() => handleBGMStop("bgm4")}>Stop BGM4</div>
    </div>
    
  );
}