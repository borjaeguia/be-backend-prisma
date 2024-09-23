import { FastifyInstance } from "fastify";
import { getUsersHandler, registerUserHandler } from "./user.controller.js";
import { $ref } from "./user.schema.js";

export const userRoutes = async (server: FastifyInstance) => {
  
  server.get('/', {
    preValidation: [server.authenticate],
  }, getUsersHandler);

  server.post('/', {
    preValidation: [server.authenticate],
    schema: {
      body: $ref("createUserInputSchema"),
      response: {
        201: $ref("createUserResponseSchema"),
      },
    },
  }, registerUserHandler);
}

