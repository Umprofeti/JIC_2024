import React from "react";
import Clock from 'bootstrap-icons/icons/clock.svg'

export const GetRecolectionTime = () => {
    return(
        <div className="z-10 p-1 rounded-full bg-white text-blue-400 w-14 shadow-md hover:scale-110 transition-all hover:cursor-pointer">
            <img className="w-full"  src={Clock.src}/>
        </div>
    )
}