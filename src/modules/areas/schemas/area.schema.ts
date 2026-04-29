import { z } from 'zod'

export const areaSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
})

export type AreaFormValues = z.infer<typeof areaSchema>
