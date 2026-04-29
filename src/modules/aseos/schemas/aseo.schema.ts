import { z } from 'zod'

export const aseoSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  cantidad: z.coerce.number().int().min(0, 'La cantidad debe ser mayor o igual a 0'),
})

export const ajusteAseoSchema = z.object({
  cantidad: z.coerce.number().int().min(1, 'La cantidad debe ser mayor a 0'),
})

export type AseoFormValues = z.infer<typeof aseoSchema>
export type AjusteAseoFormValues = z.infer<typeof ajusteAseoSchema>
