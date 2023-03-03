import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  // make sure user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  import prisma from '@/lib/prisma';

  if (req.method === 'PUT') {
    // Handle PUT request
    req.body = JSON.parse(req.body);
    const item = req.body.item ? req.body.item.trim() : null;
    let imgUrl = req.body.imgUrl ? req.body.imgUrl.trim() : null;
    const description = req.body.description
      ? req.body.description.trim()
      : null;
    const url = req.body.url ? req.body.url.trim() : null;
    let id = 0;

    if (isNaN(req.query.id)) {
      res.status(400).send('ID must be a number');
      return;
    } else id = Number(req.query.id);

    if (!item) {
      res.status(400).send('Name required');
      return;
    }

    try {
      const db_item = await prisma.item.findUnique({
        where: {
          id,
        },
      });

      const updated = await prisma.item.update({
        data: {
          item,
          imgUrl,
          description,
          url,
        },
        where: {
          id,
        },
      });
      res.status(200).json(updated);
    } catch (e) {
      console.log(e);
      res.status(500).send('Server Error');
    }
  } else if (req.method === 'GET') {
    // Handle GET request
    let id = 0;

    if (isNaN(req.query.id)) {
      res.status(400).send('ID must be a number');
      return;
    } else id = Number(req.query.id);

    const item = await prisma.item.findUnique({
      where: {
        id,
      },
    });

    if (!item) {
      res.status(400).send('Invalid ID');
      return;
    }

    res.status(200).json(item);
  } else if (req.method === 'DELETE') {
    // Handle DELETE request
    if (isNaN(req.query.id) || !req.query.id) {
      res.status(400).send('Invalid ID');
      return;
    }
    const id = Number(req.query.id);

    try {
      const item = await prisma.item.findUnique({
        where: {
          id,
        },
      });

      if (!item) {
        res.status(400).send('Invalid ID');
        return;
      }

      await prisma.item.delete({
        where: {
          id,
        },
      });

      res.status(200).send('success');
    } catch (e) {
      console.log(e);
      res.status(500).send('Server Error');
    }
  } else {
    res.status(400).send('Bad Request');
  }
}
