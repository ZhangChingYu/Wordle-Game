interface StageProps {
    image: string, 
    alt?: string    // optional attribute
}


export default function Stage({ image, alt="Stage" } : StageProps) {
    return (
        <img src={image} alt={alt} className="mx-[8pt] w-[4rem]"/>
    );
}