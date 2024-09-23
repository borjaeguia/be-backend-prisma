import { getModelByName } from '@adminjs/prisma';
import { hashPassword } from '@utils/hash.js';
import { ActionRequest, ResourceWithOptions } from 'adminjs';
import { prismaClient } from 'src/config/prisma.js';
import { CreateUserInput } from './user.schema.ts';

const userResourceOptions: ResourceWithOptions = {
  resource: {
    client: prismaClient,
    model: getModelByName("User") as never,
  },
    options: {
      properties: {
        salt: {
          isVisible: { list: false, filter: false, show: false, edit: false },
        },
        password: {
          type: 'password',
          isRequired: false,
        },
      },
      actions: {
        new: {
          before: async (request: ActionRequest): Promise<ActionRequest> => {
            const { payload } = request;
            const { hash, salt } = hashPassword(payload?.password);
  
            return {
              ...request, 
              payload: {
                ...payload, 
                password: hash,
                salt
              }
            };
          },
        },
        edit: {
          before: async (request: ActionRequest): Promise<ActionRequest> => {
            const { payload } = request;
  
            if (payload && payload.password) {
              const { hash, salt } = hashPassword(payload.password);
  
              return {
                ...request,
                payload: {
                  ...payload,
                  password: hash,
                  salt,
                },
              };
            } else {
              const { password, ...restPayload } = payload as CreateUserInput;

              return {
                ...request,
                payload: restPayload,
              };
            }
          },
        },
      },
    },
  };

  export default userResourceOptions;