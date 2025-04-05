import { useState } from "react"

interface ButtonProps {
    name: string,
    bg:string,
    hoverBg: string,
    shadowBg: string,
    clickHandler?: ()=> void;
}

export default function Button({ name, bg, hoverBg, shadowBg, clickHandler=()=>{} }: ButtonProps) {
    const [hover, setHover] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    return (
        <div className='w-[10rem] h-[3rem] rounded-md flex justify-center items-center border-1 border-black  cursor-pointer'
            style={{background:shadowBg}}>
            <div className='relative -top-[4pt] w-[10rem] h-[3rem]  px-4 py-2 flex 
                                    justify-center items-center rounded-md transfrom-all ease-in-out duration-100'
                style={hover ? { transform: clicked ? "translateY(2pt)" : "translateY(-1pt)", background: hoverBg } : { transform: "translateY(0)", background: bg }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onMouseDown={() => setClicked(true)}
                onMouseUp={() => setClicked(false)}
                onClick={() => clickHandler()} >
                <p className='text-white font-bold text-[22px]'>{name}</p>
            </div>
        </div>
    )
}