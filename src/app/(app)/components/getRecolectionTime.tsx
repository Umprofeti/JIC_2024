"use client"
import React, { useState } from 'react'
import Clock from 'bootstrap-icons/icons/clock.svg'
import type { RecolectionRoute } from '@/payload-types'
import X from 'bootstrap-icons/icons/arrow-left-short.svg'

const ShowRecolectionTime = ({data, changeState}:{data:RecolectionRoute[], changeState: () => void}) => {

    const formatDate = (date:string) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const d = new Date(date);
        return `${days[d.getDay()]} ${d.getDate()} a las `;
    }

    return (
        <div className='fixed top-0 left-0 h-screen w-full bg-gray-300/40 z-[1000]'>
            <div className='bg-white w-[70%] mt-4 h-screen rounded-r-md z-[1010] flex justify-start items-center py-4 px-2 flex-col gap-4'>
                <h3 className='px-4 py-2 border-blue-950 border-b-2 text-center w-[60%] text-2xl font-bold'>HORARIOS DE RECOLECCIÓN
                DESECHOS SÓLIDOS</h3>
                {/* Horarios */}
                <div className='flex flex-col gap-6 w-[65%]'>
                    {
                        data.map(route => {
                            return(
                                <div className='bg-white shadow-md rounded-md px-2 py-3 font-bold w-full flex flex-row gap-2 justify-center items-center hover:scale-105 transition-all hover:cursor-pointer'>
                                    <span>{formatDate(route.Fecha)}</span>
                                    <span>{
                                        route.HoraEstimadaDeLlegada > 12 ? `${route.HoraEstimadaDeLlegada} PM`
                                        : `${route.HoraEstimadaDeLlegada} AM`
                                    }</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='fixed top-12 left-4 w-[3%]'>
                    <img src={X.src} className='hover:scale-110 w-full transition-all' onClick={changeState}/>
                </div>
            </div>
        </div>
    )
}

export const GetRecolectionTime = ({ data }: { data: RecolectionRoute[] }) => {
  const [showContainer, setShowContainer] = useState(false)
  return (
    <>
      {showContainer && (
        <ShowRecolectionTime data={data} changeState={() => {setShowContainer(false)}}/>
      )}
      <div onClick={() => {setShowContainer(true)}} className="z-10 p-1 rounded-full bg-white text-blue-400 w-14 shadow-md hover:scale-110 transition-all hover:cursor-pointer">
          <img className="w-full" src={Clock.src} />
        </div>
    </>
  )
}
