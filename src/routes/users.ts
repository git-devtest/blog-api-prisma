import { Router } from "express";
import { prisma } from "../db";

export const userRouter = Router();

// Obtener todos los usuarios
userRouter.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        _count: {
          select: { posts: true, comments: true },
        },
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Obtener un usuario
userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        role: true,
        posts: {
          where: { published: true },
          include: {
            categories: true,
            _count: { select: { comments: true } },
          },
        },
        _count: {
          select: { posts: true, comments: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});
