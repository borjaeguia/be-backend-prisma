import { $Enums, PrismaClient } from '@prisma/client'
import { hashPassword } from '../../src/utils/hash.js';

const prismaClient = new PrismaClient()

async function main() {
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];

  if (!email || !password) {
    console.log('Email and password are required');
    process.exit(1);
  }

  try {
    const { hash, salt } = hashPassword(password);

    await prismaClient.user.create({
      data: { email, password: hash, salt, role: $Enums.Role.ADMIN }
    });
  } catch (error) {
    console.error(error);
    await prismaClient.$disconnect();
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })