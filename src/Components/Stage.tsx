import Image from "next/image";
interface StageProps {
    image: string, 
    alt?: string    // optional attribute
}

export default function Stage({ image, alt="Stage" } : StageProps) {
    return (
        <Image src={image} alt={alt} width={60} height={60} className="mx-[8pt]"/>
    );
}