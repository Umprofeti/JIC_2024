import type { CollectionConfig } from 'payload/types'

export const Recolectors:CollectionConfig = {
    slug: 'recolectors',
    auth: true,
    fields: [
        {
            type:'text',
            name:'IdEmpleado',
            required: true,
        },
        {
            type: 'text',
            name: 'Nombre',
            required: true,
        },
        {
            type: 'text',
            name: 'Apellido',
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
    ]
}