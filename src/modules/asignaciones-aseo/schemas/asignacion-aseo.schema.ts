import { z } from 'zod'

export const asignacionAseoSchema = z.object({
  trabajador_id: z.coerce.number().int().positive('Debe seleccionar un trabajador'),
  fecha: z.string().optional().default(''),
  items_json: z
    .string()
    .trim()
    .min(2, 'Debes ingresar al menos un item en formato JSON')
    .refine((value) => {
      try {
        const parsed = JSON.parse(value) as Array<{ aseo_id: number; cantidad: number }>
        return Array.isArray(parsed) && parsed.length > 0
      } catch {
        return false
      }
    }, 'JSON inválido de items'),
})

export type AsignacionAseoFormValues = z.infer<typeof asignacionAseoSchema>
