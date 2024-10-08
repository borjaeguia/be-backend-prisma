import * as z from "zod";
import { buildJsonSchemas } from 'fastify-zod';

// Login
const loginInputSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email is not valid"
  }).email(),
  password: z.string(),
  remember: z.boolean().optional(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
})
  
export type LoginInput = z.infer<typeof loginInputSchema>

export const { schemas: authSchemas, $ref } = buildJsonSchemas({
  loginInputSchema,
  loginResponseSchema,
}, { $id: "authSchema" });