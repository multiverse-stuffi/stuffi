const jwt = require('jsonwebtoken');
const { Configuration, OpenAIApi } = require("openai");
import AWS from 'aws-sdk';
import prisma from '../../../lib/prisma';

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

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
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
                        prompt: description ?? item,
                        n: 1,
                        size: "512x512"
                    });
                    const s3 = new AWS.S3({
                      accessKeyId: process.env.AMZ_ACCESS_KEY,
                      secretAccessKey: process.env.AMZ_SECRET_ACCESS_KEY,
                    });

                    const imgRes = await fetch(response.data.data[0].url);
                    const arrBuffer = await imgRes.arrayBuffer();
                    const buffer = Buffer.from(arrBuffer);
                    const uploadedImg = await s3.upload({
                        Bucket: process.env.AMZ_S3_BUCKET_NAME,
                        Key: item+Date.now()+'.png',
                        Body: buffer
                    }).promise();
                    imgUrl = uploadedImg.Location;
                } catch (e) {
                    if (e.response) {
                        console.log(e.response.status);
                        console.log(e.response.data);
                    } else if (e.message) {
                        console.log(e.message);
                    } else {
                        console.log(e);
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
        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, decoded) {
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
                },
                orderBy: {
                    tags: {
                        _count: 'desc'
                    }
                }
            });
            res.status(200).json(items);
        });
        else res.status(403).send('Not Authorized');
    } else res.status(400).send('Bad Request');
}