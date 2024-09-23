import * as z from "zod";
import { buildJsonSchemas } from 'fastify-zod';

// Create

const createUserSchema = z.object({
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email is not valid"
  }).email(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string(),
  dni: z.string(),
  password: z.string({
    required_error: "Password is required"
  })
});

const createUserResponseSchema = z.object({
  id: z.number(),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email is not valid"
  }).email(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
}, { $id: "userSchema" });