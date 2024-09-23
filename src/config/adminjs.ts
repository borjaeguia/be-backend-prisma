import AdminJS from "adminjs";
import AdminJSFastify from '@adminjs/fastify'
import { findUserByEmail } from "src/modules/user/user.service.js";
import { verifyPassword } from "src/utils/hash.js";
import { Database, Resource, getModelByName } from '@adminjs/prisma'
import userResourceOptions from "src/modules/user/adminjs-resource.js";
import {server} from "./server.js";
import { prismaClient } from "./prisma.js";
import artistResourceOptions from "src/modules/artist/adminjs-resource.js";

  // Configure AdminJS
  AdminJS.registerAdapter({ Database, Resource })
  
  export const adminJS = new AdminJS({
    databases: [],
    rootPath: '/admin',
    resources: [{
      resource: { model: getModelByName('User'), client: prismaClient },
      options: userResourceOptions.options,
    },
    {
      resource: { model: getModelByName('Artist'), client: prismaClient },
      options: artistResourceOptions.options,

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