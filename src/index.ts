import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fjwt from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import AdminJS from "adminjs";
import { userSchemas } from "./modules/user/user.schema.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { authSchemas } from "./modules/auth/auth.schema.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import AdminJSFastify from '@adminjs/fastify'
import { findUserByEmail } from "./modules/user/user.service.js";
import { verifyPassword } from "./utils/hash.js";
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { prismaClient } from "./prismaClient.js";

const server = Fastify();

async function main() {

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

      const decoded = request.jwt.verify(token)
      request.user = decoded
    }
  );

  server.addHook('preHandler', (request, _, next) => {
    request.jwt = server.jwt
    return next()
  });

  // Add shchemas
  const schemas = [...userSchemas, ...authSchemas]
  
  for (const schema of schemas) {
    server.addSchema(schema);
  }
  
  // Register routes
  server.get('/', () =>  'hi');
  server.register(userRoutes, {prefix: '/users'})
  server.register(authRoutes, {prefix: '/auth'})


  // Configure AdminJS
  AdminJS.registerAdapter({ Database, Resource })
  
  const adminJS = new AdminJS({
    databases: [],
    rootPath: '/admin',
    resources: [{
      resource: { model: getModelByName('User'), client: prismaClient },
      options: {},
    }],
  })
    
  const authenticate = async (email: string, password: string) => {
      
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  };
  
  const isValidPassword = verifyPassword({
    candidatePassword: password,
    salt: user.salt,
    hash: user.password
  });
    
  if (!isValidPassword) {
    return null;
  };
    
    return { email }
  }
            
  await AdminJSFastify.buildAuthenticatedRouter(
    adminJS,
    {
      authenticate,
      cookiePassword: 'cookiePassLOJKSDHFGJHSJDFHGJKSHDLFKJHGLJKSHDLFHGJHSDLKFHLGKDSword',
      cookieName: 'adminjs',
    },
    server
  )
              
  if (process.env.NODE_ENV === 'development') {
      adminJS.watch()
  }
                    
  try {
    await server.listen({ port: parseInt(process.env.PORT!), host: process.env.HOST }, () => {
      console.log(`AdminJS started on http://localhost:${process.env.PORT}${adminJS.options.rootPath}`)
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();