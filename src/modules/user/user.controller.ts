import { FastifyReply, FastifyRequest } from "fastify";
import { createUser, getUsers } from "./user.service.js";
import { CreateUserInput } from "./user.schema.js";

export const getUsersHandler =  async (request: FastifyRequest, reply: FastifyReply) => {
  const users = await getUsers();
  return users;
}

export const  registerUserHandler =  async (
  request: FastifyRequest<{
    Body: CreateUserInput;
  }>, 
  reply: FastifyReply
) => {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.status(201).send(user);
      
  } catch (error) {
    console.error(error);
    reply.status(500).send({
        message: "Internal Server Error",
        error: error
    });
  }
}