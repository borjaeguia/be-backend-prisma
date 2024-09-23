import { FastifyInstance } from "fastify";
import { getUsersHandler, registerUserHandler } from "./user.controller.js";
import { $ref } from "./user.schema.js";


export const userRoutes = async (server: FastifyInstance) => {
  
  server.get('/', {
    preHandler: [server.authenticate],
  }, getUsersHandler);

  server.post('/', {
    schema: {
      body: $ref("createUserSchema"),
      response: {
        201: $ref("createUserResponseSchema"),
      },
    },
  }, registerUserHandler);
}

