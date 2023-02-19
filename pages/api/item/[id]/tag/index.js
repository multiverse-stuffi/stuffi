const jwt = require('jsonwebtoken');
import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        if (isNaN(req.query.id) || !req.query.id) {
            res.status(400).send('Invalid ID');
            return;
        }
        const itemId = Number(req.query.id);

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            try {
                const db_item = await prisma.item.findUnique({
                    where: {
                        id: itemId
                    }
                });
                if (db_item.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const db_itemTag = await prisma.itemTag.findMany({
                    where: {
                        itemId
                    }
                });
                if (!db_itemTag) {
                    res.status(400).send('Invalid ID');
                    return;
                }
                res.status(200).json(db_itemTag);
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
    } else res.status(400).send('Bad Request');
}