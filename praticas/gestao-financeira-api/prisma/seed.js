import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultCategories = [
  {
    name: "income",
    displayName: "Renda",
    icon: "work",
    background: "#DE9AC3",
    isIncome: true,
    isDefault: true,
  },
  {
    name: "food",
    displayName: "Alimentação",
    icon: "fastfood",
    background: "#DEA17B",
    isIncome: false,
    isDefault: true,
  },
  {
    name: "house",
    displayName: "Casa",
    icon: "home",
    background: "#E6E088",
    isIncome: false,
    isDefault: true,
  },
  {
    name: "education",
    displayName: "Educação",
    icon: "book",
    background: "#AB8FBE",
    isIncome: false,
    isDefault: true,
  },
  {
    name: "travel",
    displayName: "Viagens",
    icon: "airplanemode-active",
    background: "#82C9DE",
    isIncome: false,
    isDefault: true,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "aluno@iesb.com" },
    update: {
      name: "Aluno IESB",
      passwordHash,
    },
    create: {
      name: "Aluno IESB",
      email: "aluno@iesb.com",
      passwordHash,
    },
  });

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("Seed concluído.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
