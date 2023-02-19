const jwt = require('jsonwebtoken');
import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        req.body = JSON.parse(req.body);
        const item = req.body.item ? req.body.item.trim() : null;
        let imgUrl = req.body.imgUrl ? req.body.imgUrl.trim() : null;
        const description = req.body.description ? req.body.description.trim() : null;
        const url = req.body.url ? req.body.url.trim() : null;
        let id = 0;

        if (isNaN(req.query.id)) {
            res.status(400).send('ID must be a number');
            return;
        } else id = Number(req.query.id);
        
        if (!item) {
            res.status(400).send('Name required');
            return;
        }

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
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
                        description,
                        url
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

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, decoded) {
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
    } else if (req.method === 'DELETE') {
        if (isNaN(req.query.id) || !req.query.id) {
            res.status(400).send('Invalid ID');
            return;
        }
        const id = Number(req.query.id);

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, decoded) {
            try {
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
    
                await prisma.item.delete({
                    where: {
                        id
                    }
                });

                res.status(200).send('success');
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
        else res.status(403).send('Not Authorized');
    } else res.status(400).send('Bad Request');
}