interface KeyboardProps {
    status?: string,
    value: string
}

export default function KeyBtn({status='', value}:KeyboardProps) {
    console.log(status);
    return (
        <button className="min-w-[3.4rem] h-[3.4rem] m-[1pt] px-[4pt] flex justify-center items-center rounded-sm bg-slate-500 cursor-pointer">
            <p className="text-white text-[34px] font-semibold">{value}</p>
        </button>
    );
}