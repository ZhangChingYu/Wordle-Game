interface SquareProps {
    status?:string,
    value?:string
}

export default function WordleSquare( {status='', value=''}:SquareProps ) {
    const getBgStyle = () => {
        switch (status) {
            case '':
                return 'border-2 border-slate-500';
            case 'incorrect':
                return 'bg-slate-600';
            case 'exist':
                return 'bg-amber-400';
            case 'correct':
                return 'bg-green-500';
        }
    }

    return (
        <div className={`w-[5rem] h-[4rem] mx-[4pt] flex justify-center items-center rounded-md ${getBgStyle()}`}>
            <p className="text-white text-[30px] font-bold">{value}</p>
        </div>
    )
}