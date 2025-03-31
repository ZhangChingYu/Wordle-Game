'use client';

import { useEffect, useState } from "react";

interface KeyboardProps {
    value: string,
    status?: string,
    clickHandler:(key:string)=>void
}

export default function KeyBtn({value, status='', clickHandler}:KeyboardProps) {
    const [bgColor, setBgColor] = useState<string>('bg-slate-500');
    const [idleColor, setIdleColor] = useState<string>('bg-slate-500');
    const [hoverColor, sethoverColor] = useState<string>('bg-slate-700');

    useEffect(() => {
        updateBgStyle();
    }, [status]);

    const updateBgStyle = () => {
        switch (status) {
            case '':
                setBgColor('bg-slate-500');
                setIdleColor('bg-slate-500');
                sethoverColor('bg-slate-700');
                break;
            case 'incorrect':
                setBgColor('bg-slate-500 opacity-50');
                setIdleColor('bg-slate-500 opacity-50');
                sethoverColor('bg-slate-700 opacity-50');
                break;
            case 'exist':
                setBgColor('bg-amber-400');
                setIdleColor('bg-amber-400');
                sethoverColor('bg-amber-600');
                break;
            case 'correct':
                setBgColor('bg-green-500');
                setIdleColor('bg-green-500');
                sethoverColor('bg-green-700');
                break;
        }
    }
    return (
        <div 
        className={`min-w-[3.4rem] h-[3.4rem] m-[1pt] px-[4pt] flex justify-center items-center rounded-sm cursor-pointer ${bgColor}`}
        onClick={()=>clickHandler(value)} 
        onMouseEnter={() => setBgColor(hoverColor)} 
        onMouseLeave={() => setBgColor(idleColor)}>
            <p className="text-white text-[34px] font-semibold select-none">{value}</p>
        </div>
    );
}