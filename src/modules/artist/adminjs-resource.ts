import { getModelByName } from '@adminjs/prisma';
import { hashPassword } from '@utils/hash.js';
import { ActionRequest, ResourceWithOptions } from 'adminjs';
import { prismaClient } from 'src/config/prisma.js';
import { CreateUserInput } from '../user/user.schema.ts';
import { $Enums } from '@prisma/client';

const artistResourceOptions: ResourceWithOptions = {
  resource: {
    client: prismaClient,
    model: getModelByName("Artist") as never,
  },
    options: {
      properties: {
        users: { isVisible: { list: false, filter: false, show: false, edit: false } },
        email: { type: 'string', isVisible: { list: true, filter: true, show: true, edit: true } },
        first_name: { type: 'string', isVisible: { list: true, filter: true, show: true, edit: true } },
        last_name: { type: 'string', isVisible: { list: true, filter: true, show: true, edit: true } },
        password: { type: 'password', isVisible: { edit: true, show: false, list: false } },
        phone: { type: 'string', isVisible: { edit: true, show: false, list: false } },
        dni: { type: 'string', isVisible: { edit: true, show: false, list: false } },
      },
      actions: {
        new: {
          before: async (request: ActionRequest): Promise<ActionRequest> => {

            if(!request.payload) {
              return request
            }

            const { payload } = request;
            const { hash, salt } = hashPassword(payload.password);
            const {password, ...restPayload} = payload as CreateUserInput;

            const user = await prismaClient.user.create({
              data: {
                ...restPayload,
                password: hash,
                salt,
                role: $Enums.Role.ARTIST
              },
            })

            request.payload.user = user.id
            return request
          },
        },
      },
    },
  };

  export default artistResourceOptions;