import { z } from 'zod'

export const trabajadorSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  area_id: z.coerce.number().int().positive('Debe seleccionar un área'),
  cargo_id: z.coerce.number().int().positive('Debe seleccionar un cargo'),
  talla_overol_id: z.coerce.number().int().positive('Debe seleccionar talla de overol'),
  talla_botas_id: z.coerce.number().int().positive('Debe seleccionar talla de botas'),
})

export type TrabajadorFormValues = z.infer<typeof trabajadorSchema>
