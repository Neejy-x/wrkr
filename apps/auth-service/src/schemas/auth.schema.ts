import { z } from "zod";


export const registerSchema = z.object({
    name: z.string().min(1, "na,e is required"),
    email: z.string().email("valid email is required"),
    password: z.string().min(6, "password is required")
})

export const loginSchema = z.object({
    email: z.string().email("enter a valid email"),
    password: z.string().min(6, "password requires at least 6 characters")
})


export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>