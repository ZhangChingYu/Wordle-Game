import { useEffect, useState } from "react"

interface ArrowProps {
    show?:boolean
}

export default function ShinningArrow({show=false}:ArrowProps) {
    const [cur, setCur] = useState(0);

    useEffect(() => {
        if(show) {
            setTimeout(() => {
                if(cur < 2) {
                    setCur(cur+1);
                } else {
                    setCur(0);
                }
            },200)
        }
    }, [cur, show])
    return (
        <svg width="30" height="30" viewBox="0 0 30 30" className={show?"opacity-100":"opacity-0"}>
            <path
            d="M2, 0 L12,15 L2, 30"
            stroke={cur===0?"rgba(34, 197, 93, 1)":cur===2?"rgba(34, 197, 93, 0.5)":"rgba(34, 197, 93, 0.3)"}
            strokeWidth="4"
            fill="none"
            />
            <path
            d="M10, 0 L20,15 L10, 30"
            stroke={cur===1?"rgba(34, 197, 93, 1)":cur===0?"rgba(34, 197, 93, 0.5)":"rgba(34, 197, 93, 0.3)"}
            strokeWidth="4"
            fill="none"
            />
            <path
            d="M18, 0 L28,15 L18, 30"
            stroke={cur===2?"rgba(34, 197, 93, 1)":cur===1?"rgba(34, 197, 93, 0.5)":"rgba(34, 197, 93, 0.3)"}
            strokeWidth="4"
            fill="none"
            />
        </svg>
    )
}