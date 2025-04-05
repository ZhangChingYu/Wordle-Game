interface BarProps {
    totalNum: number,
    num: number,
    barWidth: number, 
    type?: string
}

export default function Bar({totalNum, num, barWidth, type="default"}: BarProps) {
    const getBarWidth = (score:number, total:number, width: number) => {
        let result = Math.floor(score/total*width);
        if(result%2 != 0) {
            result -= 1;
        }
        return `${result}rem`;
    }

    const textElement = () => {
        switch(type){
            case "default":
                return (
                    <p className="absolute text-white font-bold text-[14px] text-center"
                        style={{width:barWidth+"rem"}}>
                        {`${num}/${totalNum}`}
                    </p>
                );
            case "ratio":
                return (
                    <p className="absolute text-white font-bold text-[14px] text-center"
                        style={{width:barWidth+"rem"}}>
                        {`${num}%`}
                    </p>
                )
        }
    }

    return (
        <div className="rounded-full border-4 border-white flex flex-row items-center"
            style={{width:barWidth+"rem", height:"2rem"}}>
            <div className="h-[18pt] rounded-full bg-red-400"
                style={{ width: getBarWidth(num, totalNum, barWidth) }}>
            </div>
            {textElement()}
        </div>
    )
}