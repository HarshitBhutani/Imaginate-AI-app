import Image from "next/image"

export const Empty = ({label})=> {
    return(
        <div className="h-full p-20 flex flex-col items-center justify-center">
            <div className="relative h-72 w-72">
                <Image alt="Empty"  src="/empty.png" height={250} width={460} /> 
            </div>
            <p className="text-muted-foreground center text-sm text-center">{label}</p>
        </div>
    )
}
