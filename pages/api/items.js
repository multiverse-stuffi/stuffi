import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
export default async function handler(req, res) {
  //check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  if (req.method === 'POST') {
    try {
      const { item, imgUrl, description, url, doGenerate } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const db_item = await prisma.item.create({
        data: {
          item,
          imgUrl,
          description,
          url,
          doGenerate,
          userId: user.id,
        },
      });
      res.status(200).json(db_item);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} not allowed.` });
  }
}
