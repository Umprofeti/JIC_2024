import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import {SetLocation} from './components/setLocation';
import { GetRecolectionTime } from './components/getRecolectionTime';
import { HeaderLogo } from './components/headerLogo';

//Se debe comentar para que funcione en celular, no eliminar
import MapComponent from './components/MapComponent';
import dynamic from 'next/dynamic';
import { NextRequest } from 'next/server';
import MapComponentClient from './components/MapComponentClient';

const payload = await getPayloadHMR({ config: configPromise })

const dataReco = await payload.find({
  collection: 'recolectors',
  depth: 2,
})

const dataRecolectionTime = await payload.find({
  collection: "recolection-routes",
})


//Se debe comentar para que funcione en celular, no eliminar
// const MapComponent = dynamic(() => import('./components/MapComponent'), { ssr: false });


export default async function Page(req:NextRequest) {


  //Se debe cambiar a false para ver el mapa del cliente
  let cliente = true


  return (
    <section className=' overflow-hidden '>
      <div className='flex justify-center items-center w-full top-0 fixed z-10'>
        <HeaderLogo/>
      </div>
      <div className=''>
        {cliente?
        <MapComponentClient customersInfo={dataRecolectionTime} recolectorInfo={dataReco.docs[0]} />
        :
        <MapComponent customersInfo={dataRecolectionTime} recolectorInfo={dataReco.docs[0]} />
        }
      </div>
      <div className='flex w-full justify-between bottom-2 px-3 fixed z-10'>
        <GetRecolectionTime/>
        <SetLocation/>
      </div>
    </section>
  )
}
