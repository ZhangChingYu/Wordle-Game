'use client';

import { useState } from "react";

interface KeyboardProps {
    value: string,
    clickHandler:(key:string)=>void
}

export default function KeyBtn({value, clickHandler}:KeyboardProps) {
    const [bgColor, setBgColor] = useState('bg-slate-500');
    return (
        <div 
        className={`min-w-[3.4rem] h-[3.4rem] m-[1pt] px-[4pt] flex justify-center items-center rounded-sm cursor-pointer ${bgColor}`}
        onClick={()=>clickHandler(value)} onMouseEnter={()=>setBgColor('bg-slate-700')} onMouseLeave={() => setBgColor('bg-slate-500')}>
            <p className="text-white text-[34px] font-semibold">{value}</p>
        </div>
    );
}