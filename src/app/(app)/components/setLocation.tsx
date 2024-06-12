import React from "react";
import Plus from 'bootstrap-icons/icons/plus.svg'

export const SetLocation= () => {
    return (
        <div className=" rounded-full bg-white text-blue-400 w-14 shadow-md hover:scale-110 transition-all hover:cursor-pointer">
            <img src={Plus.src} className="w-full" />
        </div>
    )
}