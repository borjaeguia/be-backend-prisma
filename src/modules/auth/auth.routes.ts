import { FastifyInstance } from "fastify";
import { loginHandler, logoutHandler } from "./auth.controller.js";
import { $ref } from "./auth.schema.js";


export const authRoutes = async (server: FastifyInstance) => {
  
  server.post('/login',  {
    schema: {
      body: $ref("loginSchema"),
      response: {
        201: $ref("loginResponseSchema"),
      }
    }
  }, loginHandler);

  server.delete(
    '/logout',
    {
      preHandler: [server.authenticate],
    },
    logoutHandler
  )

}