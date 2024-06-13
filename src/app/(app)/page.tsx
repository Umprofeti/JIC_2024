import React from 'react'
import dynamic from 'next/dynamic';
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import {SetLocation} from './components/setLocation';
import { GetRecolectionTime } from './components/getRecolectionTime';
import { HeaderLogo } from './components/headerLogo';
/* import MapComponent from './components/MapComponent'; */

const payload = await getPayloadHMR({ config: configPromise })

const dataUbi = await payload.find({
  collection: 'customers',
  depth: 2,
})

const dataReco = await payload.find({
  collection: 'recolectors',
  depth: 2,
})

const MapComponent = dynamic(
  () => import('./components/MapComponent'),
  { ssr: false }
);



export default async function Page() {
  return (
    <section className=' overflow-hidden !z-0'>
      <div className='flex justify-center items-center w-full top-0 fixed z-[999]'>
        <HeaderLogo/>
      </div>
      <div className='!z-0'>
        <MapComponent customersInfo={dataUbi} recolectorInfo={dataReco.docs[0]} />
      </div>
      <div className='flex w-full justify-between bottom-2 px-3  fixed z-[999]'>
        <GetRecolectionTime/>
        <SetLocation/>
      </div>
    </section>
  )
}

