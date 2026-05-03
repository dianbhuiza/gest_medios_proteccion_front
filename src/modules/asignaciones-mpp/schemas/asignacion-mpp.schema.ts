import { z } from 'zod'

export const asignacionMppItemSchema = z.object({
  mpp_id: z.number().int().positive('Debe seleccionar un EPP'),
  talla_id: z.number().int().nullable().default(null),
  requiere_talla: z.boolean().default(false),
})

export const asignacionMppSchema = z.object({
  trabajador_id: z.coerce.number().int().positive('Debe seleccionar un trabajador'),
  items: z
    .array(asignacionMppItemSchema)
    .min(1, 'Debes agregar al menos un EPP'),
})

export type AsignacionMppFormValues = z.infer<typeof asignacionMppSchema>
export type AsignacionMppItemForm = z.infer<typeof asignacionMppItemSchema>
