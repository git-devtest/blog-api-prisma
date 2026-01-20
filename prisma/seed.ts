import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcrypt";

const db = process.env.DATABASE_URL || "./dev.db";
const adapter = new PrismaBetterSqlite3({ url: db });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Crear categorías
  const tech = await prisma.category.create({
    data: { name: "Tecnología", slug: "tecnologia" },
  });

  const programming = await prisma.category.create({
    data: { name: "Programación", slug: "programacion" },
  });

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@blog.com",
      password: await bcrypt.hash("123456", 10),
      name: "Admin",
      bio: "Administrador del blog",
      role: "ADMIN",
    },
  });

  // Crear posts
  await prisma.post.create({
    data: {
      title: "Introducción a Prisma 7",
      slug: "introduccion-a-prisma-7",
      content: "Contenido completo del post...",
      excerpt: "Aprende lo nuevo de Prisma 7",
      published: true,
      authorId: admin.id,
      categories: {
        connect: [{ id: tech.id }, { id: programming.id }],
      },
    },
  });

  console.log("✅ Base de datos poblada con datos de prueba");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
