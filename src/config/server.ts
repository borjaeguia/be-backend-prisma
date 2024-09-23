import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from '@fastify/jwt'
import { userRoutes } from "src/modules/user/user.routes.js";
import { authSchemas } from "src/modules/auth/auth.schema.js";
import { authRoutes } from "src/modules/auth/auth.routes.js";
import { userSchemas } from "src/modules/user/user.schema.js";

export const server = Fastify();

// Register fjwt
server.register(fjwt, {
  secret: process.env.JWT_SECRET || '123'
});

server.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.access_token;

    if (!token) {
      return reply.status(401).send({ message: 'Authentication required' })
    }

    const decoded = server.jwt.verify(token)
    request.user = decoded
  }
);

// Add shchemas
const schemas = [...userSchemas, ...authSchemas]
  
for (const schema of schemas) {
  server.addSchema(schema);
}

// Register routes
server.get('/', () =>  'hi');
server.register(userRoutes, {prefix: '/users'})
server.register(authRoutes, {prefix: '/auth'})
