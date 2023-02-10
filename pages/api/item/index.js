const jwt = require('jsonwebtoken');
const { Configuration, OpenAIApi } = require("openai");
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        req.body = JSON.parse(req.body);
        const item = req.body.item ? req.body.item.trim() : null;
        let imgUrl = req.body.imgUrl ? req.body.imgUrl.trim() : null;
        const description = req.body.description ? req.body.description.trim() : null;
        const url = req.body.url ? req.body.url.trim() : null;

        if (!item) {
            res.status(400).send('Name required');
            return;
        }

        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (!decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }

            try {
                const db_item = await prisma.item.create({
                    data: {
                        item,
                        imgUrl,
                        description,
                        url,
                        userId: decoded.id
                    }
                });
                res.status(200).json(db_item);
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
            
            const items = await prisma.item.findMany({
                where: {
                    userId: decoded.id
                },
                include: {
                    tags: {
                        include: {
                            Tag: true
                        }
                    }
                }
            });
            res.status(200).json(items);
        });
        else res.status(403).send('Not Authorized');
    } else res.status(400).send('Bad Request');
}