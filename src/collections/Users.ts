import type { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      type: 'text',
      name: 'Nombre',
      required:true
    },
    {
      type: 'text',
      name: 'Apellido',
      required: true
    },
    {
      type: 'select',
      name: 'rol',
      required: true,
      options:['Admin', 'Funcionario']
    }
  ],
}
