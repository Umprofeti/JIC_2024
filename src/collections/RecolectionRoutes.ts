import type { CollectionConfig } from 'payload/types'

export const RecolectionRoutes:CollectionConfig = {
    slug: 'recolectionroutes',
    auth: false,
    fields: [
        {
            type:'text',
            name:'Provincia',
            required: true,
        },
        {
            type: 'text',
            name: 'Distrito',
            required: true,
        },
        {
            type: 'text',
            name: 'Corregimiento',
            required: true,
        },
        {
            type: 'text',
            name: 'Barriada',
            required: true,
        },
        {
            type: 'text',
            name: 'Latitud',
        },
        {
            type: 'text',
            name: 'Longitud',
        },
        {
            type: 'number',
            name: 'HoraEstimadaDeLlegada',
            required: true
        },
        {
            type: 'date',
            name: 'Fecha',
            required: true
        },
    ]
}