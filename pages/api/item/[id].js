const jwt = require('jsonwebtoken');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const item = req.body.item;
        const imgUrl = req.body.imgUrl;
        const description = req.body.description;
        let id = 0;

        if (isNaN(req.query.id)) {
            res.status(400).send('ID must be a number');
            return;
        } else id = Number(req.query.id);
        
        if (!item.trim()) {
            res.status(400).send('Name required');
            return;
        }

        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (!decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }

            try {
                const db_item = await prisma.item.findUnique({
                    where: {
                        id
                    }
                });
                if (db_item.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const updated = await prisma.item.update({
                    data: {
                        item,
                        imgUrl,
                        description
                    },
                    where: {
                        id
                    }
                })
                res.status(200).json(updated);
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
            
        });
        else res.status(403).send('Not Authorized');
    } else if (req.method === 'GET') {
        let id = 0;

        if (isNaN(req.query.id)) {
            res.status(400).send('ID must be a number');
            return;
        } else id = Number(req.query.id);

        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, decoded) {
            if (!decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }
            
            const item = await prisma.item.findUnique({
                where: {
                    id
                }
            });

            if (!item) {
                res.status(400).send('Invalid ID');
                return;
            }

            if (item.userId !== decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }
            
            res.status(200).json(item);
        });
        else res.status(403).send('Not Authorized');
    }
}