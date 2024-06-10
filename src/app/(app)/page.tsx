import React from 'react'
import dynamic from 'next/dynamic';
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
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
    <section className=' overflow-hidden'>
      hola
      <MapComponent customersInfo={dataUbi} recolectorInfo={dataReco.docs[0]} />
    </section>
  )
}

