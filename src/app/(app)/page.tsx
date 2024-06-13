import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import {SetLocation} from './components/setLocation';
import { GetRecolectionTime } from './components/getRecolectionTime';
import { HeaderLogo } from './components/headerLogo';
import MapComponent from './components/MapComponent';
// import dynamic from 'next/dynamic';

const payload = await getPayloadHMR({ config: configPromise })

  const dataUbi = await payload.find({
    collection: 'customers',
    depth: 2,
  });

const dataReco = await payload.find({
  collection: 'recolectors',
  depth: 2,
})

const dataRecolectionTime = await payload.find({
  collection: 'recolectionroutes',
  depth: 2
})

// const MapComponent = dynamic(() => import('./components/MapComponent'), { ssr: false });


export default async function Page() {
 console.log(dataRecolectionTime)
  return (
    <section className=' overflow-hidden '>
      <div className='flex justify-center items-center w-full top-0 fixed z-10'>
        <HeaderLogo/>
      </div>
      <div className=''>
        <MapComponent customersInfo={dataRecolectionTime} recolectorInfo={dataReco.docs[0]} />
      </div>
      <div className='flex w-full justify-between bottom-2 px-3 fixed z-10'>
        <GetRecolectionTime/>
        <SetLocation/>
      </div>
    </section>
  )
}
