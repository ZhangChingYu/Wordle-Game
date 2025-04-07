import { Button } from "@/Components";

interface SettingWindowProps {
    closeHandler: () => void,
}

export default function Setting({closeHandler}:SettingWindowProps) {

    return (
        <div className="absolute w-screen h-screen flex flex-col justify-center items-center">
            <div>
                
            </div>
            <div className="w-[40rem] h-[30rem] bg-slate-600 flex flex-row justify-center items-center rounded-3xl gap-8">
                <Button name="HOME" bg="var(--color-amber-400)" hoverBg="var(--color-amber-300)" shadowBg="var(--color-amber-600)"/>
                <Button name="GO BACK" bg="var(--color-green-500)" hoverBg="var(--color-green-400)" shadowBg="var(--color-green-600)"
                    clickHandler={closeHandler}/>
            </div>
        </div>
    )
}