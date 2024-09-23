import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { findUserByEmail } from "../user/user.service.js";
import { LoginInput } from "./auth.schema.js";
import { verifyPassword } from "../../utils/hash.js";

export const loginHandler =  async (
  request: FastifyRequest<{
    Body: LoginInput
  }>, 
    reply: FastifyReply,
    server: FastifyInstance
  ) => {
  const body = request.body;

  // Try to find a user by email 
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.status(401).send({
        message: "Invalid email address. Try again!"
    });
  };

  // Verify password
  const isValidPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password
  });

  if (!isValidPassword) {
    return reply.status(401).send({
      message: "Password is incorrect"
    });
  };

  // Generate access token
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
  }
  const token = server.jwt.sign(payload);

  // Set cookie to reply
  reply.setCookie('access_token', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    ...(!body.remember ? { maxAge: 1000 * 60 * 60 * 24 * 7, /*for a week */ } : null )
  })

  return "Login succeed"
}

export const  logoutHandler =  async (_: FastifyRequest, reply: FastifyReply) => {
  reply.clearCookie('access_token');

  return reply.status(201).send({ message: 'Logout successfully' })
}