import { hashPassword } from "@utils/hash.js";
import { CreateUserInput } from "./user.schema.js";
import { prismaClient } from "src/config/prisma.js";

export const createUser = async (input: CreateUserInput) => {
    
  const { password, ...rest } = input;
  
  const { hash, salt } = hashPassword(password);

  const user = await prismaClient.user.findFirst({
    where: { email: input.email },
  });
  
  if (user ) {
    return 'User already exists'
  }

  try {
    const user = await prismaClient.user.create({
        data: {...rest, salt, password: hash, }
    });
    return user;
  } catch {
    return 'error';
  }
}

export const getUsers = async () => {
  const users = await prismaClient.user.findMany()
  return users.map(({id, email}) => ({id, email}))
}

export const findUserByEmail =  async (email: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  })
  return user
}