const jwt = require('jsonwebtoken');
const { Configuration, OpenAIApi } = require("openai");
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const item = req.body.item;
        let imgUrl = req.body.imgUrl;
        const description = req.body.description;

        if (!item.trim()) {
            res.status(400).send('Name required');
            return;
        }

        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            if (!decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }

            if (!imgUrl) {
                try {
                    const config = new Configuration({
                        apiKey: process.env.OPENAI_KEY
                    });
                    const openai = new OpenAIApi(config);
                    const response = await openai.createImage({
                        prompt: item,
                        n: 1,
                        size: "512x512"
                    });
                    imgUrl = response.data.data[0].url;
                } catch (e) {
                    if (e.response) {
                      console.log(e.response.status);
                      console.log(e.response.data);
                    } else {
                      console.log(e.message);
                    }
                    imgUrl = null;
                }
            }
            
            try {
                const db_item = await prisma.item.create({
                    data: {
                        item,
                        imgUrl,
                        description,
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
                }
            });
            res.status(200).json(items);
        });
        else res.status(403).send('Not Authorized');
    }
}