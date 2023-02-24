import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  //add to faves

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          favoriteItems: true,
        },
      });
      res
        .status(200)
        .json(
          user?.favoriteItems?.map((favorite) => favorite.id) ?? []
        );
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res
      .status(405)
      .json({ message: `Method ${req.method} is not supported.` });
  }
}