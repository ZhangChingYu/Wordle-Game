'use client';

interface SquareProps {
    status?:string,
    value?:string,
    flipDelay?:string,
    animation?: string
}

export default function WordleSquare( {status='', value='', flipDelay='0', animation=''}:SquareProps ) {
    const getBgStyle = () => {
        switch (status) {
            case '':
                return 'bg-slate-800 border-2 border-slate-500';
            case 'incorrect':
                return 'bg-slate-600';
            case 'exist':
                return 'bg-amber-400';
            case 'correct':
                return 'bg-green-500';
            case 'clear':
                return 'bg-green-500 border-2 border-slate-500';
        }
    }
    

    const getAnimation = () => {
        switch(animation) {
            case '':
                return 'border-2 border-slate-500'
            case 'flip':
                return 'rotate-x-180 '+getBgStyle();
            case 'error':
                return 'border-2 border-slate-500 animate-shake';
            case 'win':
                return 'border-2 border-white ' + getBgStyle();
            case 'open':
                return 'rotate-x-180 '+getBgStyle();
            default:
                return 'border-2 border-slate-500';
        }
    }

    return (
        <div className={`w-[5rem] h-[4rem] mx-[4pt] flex justify-center items-center 
            transition-all duration-600 ease-in-out rounded-md ${getAnimation()}`}
            style={{ transitionDelay: `${flipDelay}ms` }}>
            <p className={` text-[30px] font-bold  
                transition-all duration-600 ease-in-out
                ${animation==="flip" ? "rotate-x-180 text-white": animation==="error"?"text-red-500":"text-white"} `}
                style={{ transitionDelay: `${flipDelay}ms` }} >
                {value}
            </p>
        </div>
    );
}