import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed_password_here",
    },
  });
  console.log("Dummy user created");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
