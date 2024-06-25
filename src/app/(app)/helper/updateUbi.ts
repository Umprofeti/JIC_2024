import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import type { RecolectionRoute } from '@/payload-types';



async function updateData(lat:string, lon:string): Promise<RecolectionRoute> {
    const payload = await getPayloadHMR({ config: configPromise })
    let dataUpdate = await payload.update({
      collection: 'recolection-routes',
      id: '667a182e969ae95b6a9ade7e',
      data:{
        Latitud: lat,
        Longitud: lon
    }})
    return dataUpdate
  }

export { updateData }