import prisma from '@lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  try {
    // Check if user is authenticated
    const session = await getSession({ req });
    if (!session) {
      res.status(401).json({ message: 'Unauthorized.' });
      return;
    }

    const { method, body, query } = req;
    const itemId = Number(query.id);
    const tagId = Number(query.tagId);

    if (method === 'POST') {
      const value = isNaN(body.value) ? null : Number(body.value);

      if (isNaN(itemId) || isNaN(tagId)) {
        res.status(400).send('Invalid ID(s)');
        return;
      }

      const db_itemTag = await prisma.itemTag.findFirst({
        where: {
          itemId,
          tagId,
        },
      });

      if (db_itemTag) {
        res.status(400).send('Already exists');
        return;
      }

      const [db_item, db_tag] = await Promise.all([
        prisma.item.findUnique({ where: { id: itemId } }),
        prisma.tag.findUnique({ where: { id: tagId } }),
      ]);

      if (!db_item || !db_tag) {
        res.status(400).send('Invalid Item ID');
        return;
      }

      const itemTag = await prisma.itemTag.create({
        data: { itemId, tagId, value },
      });

      res.status(200).json(itemTag);
    } else if (method === 'PUT') {
      const value = isNaN(body.value) ? null : Number(body.value);

      if (isNaN(itemId) || isNaN(tagId)) {
        res.status(400).send('Invalid ID(s)');
        return;
      }

      const db_itemTag = await prisma.itemTag.findFirst({
        where: {
          itemId,
          tagId,
        },
      });

      if (!db_itemTag) {
        res.status(400).send('Does not exist');
        return;
      }

      const db_item = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!db_item) {
        res.status(400).send('Invalid Item ID');
        return;
      }

      const db_tag = await prisma.tag.findUnique({
        where: { id: tagId },
      });

      if (!db_tag) {
        res.status(400).send('Invalid Item ID');
        return;
      }

      const itemTag = await prisma.itemTag.update({
        data: { value },
        where: { id: db_itemTag.id },
      });

      res.status(200).json(itemTag);
    } else if (method === 'GET') {
      if (isNaN(itemId) || isNaN(tagId)) {
        res.status(400).send('Invalid ID(s)');
        return;
      }

      const db_itemTag = await prisma.itemTag.findFirst({
        where: { itemId, tagId },
        include: { Item: { select: { userId: true } } },
      });

      if (!db_itemTag) {
        res.status(400).send('Invalid ID(s)');
        return;
      }

      delete db_itemTag.Item;
      res.status(200).json(db_itemTag);
    } else if (method === 'DELETE') {
      if (isNaN(itemId) || isNaN(tagId)) {
        res.status(400).send('Invalid ID(s)');
        return;
      }
      try {
        const db_itemTag = await prisma.itemTag.findFirst({
          where: { itemId, tagId },
          include: { Item: { select: { userId: true } } },
        });

        if (!db_itemTag) {
          res.status(400).send('Invalid ID(s)');
          return;
        }

        await prisma.itemTag.delete({
          where: { id: db_itemTag.id },
        });

        delete db_itemTag.Item;
        res.status(200).json(db_itemTag);
      } catch (error) {
        res.status(500).send('Server Error');
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res
        .status(405)
        .json({ message: `HTTP method ${req.method} not allowed.` });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
}
