const jwt = require('jsonwebtoken');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const tag = req.body.tag ? req.body.tag.trim() : null;
        const isVariable = req.body.isVariable;

        if (!tag) {
            res.status(400).send('Name required');
            return;
        }

        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (!decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }

            try {
                const db_tag = await prisma.tag.create({
                    data: {
                        tag,
                        isVariable,
                        userId: decoded.id
                    }
                });
                res.status(200).json(db_tag);
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
        else res.status(403).send('Not Authorized');
    } else if (req.method === 'GET') {
        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, decoded) {
            if (!decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }
            
            const tags = await prisma.tag.findMany({
                where: {
                    userId: decoded.id
                }
            });
            res.status(200).json(tags);
        });
        else res.status(403).send('Not Authorized');
    } else res.status(400).send('Bad Request');
}