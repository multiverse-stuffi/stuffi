import { getSession } from 'next-auth/react';
import { prisma } from '@lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  //get item id from query
  const { id } = req.query;

  //add to faves
  if (req.method === 'PUT') {
    try {
      const user = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          favoriteItems: {
            connect: { id },
          },
        },
        include: {
          listedItems: true,
          favoriteItems: true,
        },
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
  //remove from faves
  else if (req.method === 'DELETE') {
    try {
      const user = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          favoriteItems: {
            disconnect: { id },
          },
        },
        include: {
          listedItems: true,
          favoriteItems: true,
        },
      });
      res.status(200).json(user);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res
      .status(405)
      .json({ message: `Method ${req.method} is not supported.` });
  }
}
