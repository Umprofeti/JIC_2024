import type { CollectionConfig } from 'payload/types'

export const Customers:CollectionConfig = {
    slug: 'customers',
    auth: true,
    fields: [
        {
            type:'text',
            name:'NIC',
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
            type: 'textarea',
            name: 'LugarDeResidencia',
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