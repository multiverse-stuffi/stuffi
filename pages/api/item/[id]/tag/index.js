import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { sortedItems: true },
  });

  if (req.method === 'GET') {
    if (isNaN(req.query.id) || !req.query.id) {
      res.status(400).send('Invalid ID');
      return;
    }
    const itemId = Number(req.query.id);

    const db_item = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!db_itemTag) {
      res.status(400).send('Invalid ID');
      return;
    }
    res.status(200).json(db_itemTag);
  } else {
    res.status(500).send('Server Error');
  }
}
