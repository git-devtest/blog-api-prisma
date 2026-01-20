import { Router } from "express";
import { prisma } from "../db";

export const postRouter = Router();

// Obtener todos los posts
postRouter.get("/", async (req, res) => {
  try {
    const { page = "1", limit = "10", published } = req.query;

    const posts = await prisma.post.findMany({
      where: published === "true" ? { published: true } : undefined,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        categories: true,
        _count: {
          select: { comments: true },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.post.count({
      where: published === "true" ? { published: true } : undefined,
    });

    res.json({
      data: posts,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener posts" });
  }
});

// Obtener un post por slug
postRouter.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        author: {
          select: { id: true, name: true, bio: true, avatar: true },
        },
        categories: true,
        comments: {
          include: {
            author: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.status(404).json({ error: "Post no encontrado" });
  }
});

// Crear un post
postRouter.post("/", async (req, res) => {
  try {
    const { title, content, excerpt, authorId, categoryIds } = req.body;

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        authorId,
        categories: {
          connect: categoryIds.map((id: number) => ({ id })),
        },
      },
      include: {
        author: true,
        categories: true,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Error al crear post" });
  }
});

// Actualizar un post
postRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, published, categoryIds } = req.body;

    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        excerpt,
        published,
        categories: categoryIds
          ? {
              set: categoryIds.map((id: number) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: true,
        categories: true,
      },
    });

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar post" });
  }
});

// Eliminar un post
postRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Error al eliminar post" });
  }
});
