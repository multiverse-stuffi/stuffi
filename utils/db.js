import { PrismaClient } from '@prisma/client';

const getItems = async () => {
  const prisma = new PrismaClient();
  const items = await prisma.item.findMany({
    include: {
      tags: true,
    },
  });
  await prisma.$disconnect();
  return items;
};

const getItemById = async (id) => {
  const prisma = new PrismaClient();
  const item = await prisma.item.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      tags: true,
    },
  });
  await prisma.$disconnect();
  return item;
};

const getItem = async (id) => {
  const prisma = new PrismaClient();
  const item = await prisma.item.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  await prisma.$disconnect();
  return item;
};

const getUserByEmail = async (email) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      items: true,
    },
  });
  await prisma.$disconnect();
  return user;
};

const getTags = async () => {
  const prisma = new PrismaClient();
  const tags = await prisma.tag.findMany();
  await prisma.$disconnect();
  return tags;
};

const getTagById = async (id) => {
  const prisma = new PrismaClient();
  const tag = await prisma.tag.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      items: true,
    },
  });
  await prisma.$disconnect();
  return tag;
};

const createUser = async (email, stripeId) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.create({
    data: {
      email,
      stripeId,
    },
  });
  await prisma.$disconnect();
  return user;
};

const enrollUser = async (email, itemId) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      items: {
        connect: {
          id: parseInt(itemId),
        },
      },
    },
    include: {
      items: true,
    },
  });
  await prisma.$disconnect();
  return user;
};

const subscribeUser = async (stripeId) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.update({
    where: {
      stripeId,
    },
    data: {
      isSubscribed: true,
    },
  });
  await prisma.$disconnect();
  return user;
};

const cancelSubscription = async (stripeId) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.update({
    where: {
      stripeId,
    },
    data: {
      isSubscribed: false,
    },
  });
  await prisma.$disconnect();
  return user;
};

export {
  getItems,
  getItemById,
  getItem,
  getUserByEmail,
  getTags,
  getTagById,
  createUser,
  enrollUser,
  subscribeUser,
  cancelSubscription,
};
