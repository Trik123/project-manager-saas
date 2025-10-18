import pkg from "@prisma/client";
import bcrypt from "bcrypt";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
  const email = "test@example.com";

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("User already exists:", email);
    return;
  }

  // Hash the password
  const passwordHash = await bcrypt.hash("password123", 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name: "Test User",
      passwordHash,
    },
  });

  console.log("Dummy user created:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());