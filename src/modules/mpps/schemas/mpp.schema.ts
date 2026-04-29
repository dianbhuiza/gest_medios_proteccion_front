import { z } from 'zod'

export const mppSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  tipo_talla: z.string().trim().min(1, 'El tipo de talla es obligatorio'),
})

export const mppStockActionSchema = z.object({
  talla_id: z.coerce.number().int().positive('Debe seleccionar talla'),
  cantidad: z.coerce.number().int().min(0, 'La cantidad debe ser mayor o igual a 0'),
})

export type MppFormValues = z.infer<typeof mppSchema>
export type MppStockActionValues = z.infer<typeof mppStockActionSchema>
