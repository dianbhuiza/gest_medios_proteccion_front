import { z } from 'zod'

export const tallaSchema = z.object({
  valor: z.string().trim().min(1, 'El valor es obligatorio'),
  tipo: z.string().trim().min(1, 'El tipo es obligatorio'),
  orden: z.coerce.number().int().min(0, 'El orden debe ser mayor o igual a 0'),
})

export type TallaFormValues = z.infer<typeof tallaSchema>
