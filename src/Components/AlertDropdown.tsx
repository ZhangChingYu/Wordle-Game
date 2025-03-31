import { useEffect } from "react"

interface DropdownProps {
    show:boolean,
    message:string,
    clickHandler:(flag:boolean)=>void
}

export default function DropdownWindow({show, message, clickHandler}:DropdownProps) {
    useEffect(() => {
        setTimeout(() => {
            clickHandler(false);
        }, 1200);
    }, [show])

    return (
        <div className={`absolute top-[0px] w-auto h-auto py-[1rem] px-[2rem] rounded-sm bg-white 
                        flex flex-col items-center transition-all duration-300 ease-in-out 
                        ${show?"opacity-100 translate-y-10":"opacity-0 translate-y-0"}` }>
            <p className="font-bold text-black">{message}</p>
        </div>
    )
}