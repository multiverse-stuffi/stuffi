import prisma from '@prisma/lib/prisma';
import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  try {
    // Check if user is authenticated
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    if (req.method === 'PUT') {
      const { tag, isVariable, color } = req.body;

      if (!tag) {
        return res.status(400).send('Name required');
      }

      const id = Number(req.query.id);
      if (isNaN(id)) {
        return res.status(400).send('ID must be a number');
      }

      const db_tag = await prisma.tag.findUnique({ where: { id } });
      if (!db_tag) {
        return res.status(404).send('Tag not found');
      }

      const updated = await prisma.tag.update({
        data: { tag, isVariable, color },
        where: { id },
      });

      return res.status(200).json(updated);
    } else if (req.method === 'GET') {
      const id = Number(req.query.id);
      if (isNaN(id)) {
        return res.status(400).send('ID must be a number');
      }

      const tag = await prisma.tag.findUnique({ where: { id } });
      if (!tag) {
        return res.status(404).send('Tag not found');
      }

      return res.status(200).json(tag);
    } else if (req.method === 'DELETE') {
      const id = Number(req.query.id);
      if (isNaN(id)) {
        return res.status(400).send('ID must be a number');
      }

      const db_tag = await prisma.tag.findUnique({ where: { id } });
      if (!db_tag) {
        return res.status(404).send('Tag not found');
      }

      await prisma.tag.delete({ where: { id } });

      return res.status(200).json(db_tag);
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res
        .status(405)
        .json({ message: `HTTP method ${req.method} not allowed.` });
    }
  } catch (error) {
    return res.status(500).send('Server Error');
  }
}

