import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedItems: true },
  });

  const { id } = req.query;
  if (!user?.listedItems?.find((item) => item.id === id)) {
    return res.status(403).json({ message: 'Unauthorized.' });
  }
  // Update item
  if (req.method === 'PATCH') {
    try {
      const item = await prisma.item.update({
        where: { id },
        data: req.body,
      });
      res.status(200).json(item);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
  //delete item
  else if (req.method === 'DELETE') {
    try {
      const item = await prisma.item.delete({
        where: { id },
      });
      res.status(200).json(item);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong!' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).json({
      message: `HTTP method ${req.method} is not supported.`,
    });
  }
}
