import { z } from 'zod'

export const cargoSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
})

export type CargoFormValues = z.infer<typeof cargoSchema>
