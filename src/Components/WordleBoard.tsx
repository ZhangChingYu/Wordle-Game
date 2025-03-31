import { WordleSquare } from "@/Components";
interface WordleProps {
    inputs: ({
        value: string;
        status: string;
        animation: string;
    } | {
        value: string;
        status: string;
        animation?: undefined;
    })[][]
}

export default function WordleBoard({inputs}:WordleProps) {
    return (
        <div className="w-full py-[1rem]">
            <div className="w-full h-auto flex flex-col justify-center">
                {inputs.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-row justify-center items-center pt-[.5rem]">
                        {row.map((item, colIndex) => (
                            <WordleSquare
                                key={colIndex}
                                value={item.value}
                                status={item.status}
                                flipDelay={item.animation === "flip" ? `${colIndex * 500}` : '0'}
                                animation={item.animation} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )

}