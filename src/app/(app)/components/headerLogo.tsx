import React from "react";
import Image from "next/image";
import Logo from '../../../public/logo.svg'

export const HeaderLogo = () => {
    return (
        <div className="w-3/4 shadow-md rounded-b-lg bg-white text-blue-400 flex items-center justify-center h-14">
            <Image 
                src={Logo.src}
                alt="Logo"
                width={Logo.width}
                height={Logo.height}
                className="mx-auto w-[8%] h-auto mt-1"
            />
        </div>
    )
}