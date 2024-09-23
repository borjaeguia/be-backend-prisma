import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { loginHandler, logoutHandler } from "./auth.controller.js";
import { $ref, LoginInput } from "./auth.schema.js";


export const authRoutes = async (server: FastifyInstance) => {
  
  server.post('/login',  {
    schema: {
      body: $ref("loginInputSchema"),
      response: {
        201: $ref("loginResponseSchema"),
      }
    }
  }, (request: FastifyRequest<{
    Body: LoginInput
}>, 
  reply: FastifyReply) =>  loginHandler(request, reply, server));

  server.delete(
    '/logout',
    {
      preValidation: [server.authenticate],
    },
    logoutHandler
  )

}