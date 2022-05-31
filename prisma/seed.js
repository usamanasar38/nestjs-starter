/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function accountSeeder() {
  console.log(`Start seeding account...`);
  const account = {
    name: 'Foo Bar',
    password: 'asdf',
  };
  const newAccount = await prisma.account.upsert({
    where: {
      id: 1,
    },
    create: {
      ...account,
    },
    update: {
      ...account,
    },
  });
  console.log(`Created Account with id: ${newAccount.id} - ${newAccount.name}`);
  console.log(`Seeding finished.`);
}

async function main() {
  await accountSeeder();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
