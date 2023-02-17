const jwt = require('jsonwebtoken');
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        req.body = JSON.parse(req.body);
        const tag = req.body.tag ? req.body.tag.trim() : null;
        const isVariable = req.body.isVariable;
        const color = req.body.color ? req.body.color.trim() : null;
        let id = 0;

        if (isNaN(req.query.id)) {
            res.status(400).send('ID must be a number');
            return;
        } else id = Number(req.query.id);
        
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
                const db_tag = await prisma.tag.findUnique({
                    where: {
                        id
                    }
                });
                if (db_tag.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const updated = await prisma.tag.update({
                    data: {
                        tag,
                        isVariable,
                        color
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
            
            const tag = await prisma.tag.findUnique({
                where: {
                    id
                }
            });

            if (!tag) {
                res.status(400).send('Invalid ID');
                return;
            }

            if (tag.userId !== decoded.id) {
                res.status(403).send('Not Authorized');
                return;
            }

            res.status(200).json(tag);
        });
        else res.status(403).send('Not Authorized');
    } else if (req.method === 'DELETE') {
        if (isNaN(req.query.id) || !req.query.id) {
            res.status(400).send('Invalid ID');
            return;
        }
        const id = Number(req.query.id);

        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, decoded) {
            try {
                if (!decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
    
                const tag = await prisma.tag.findUnique({
                    where: {
                        id
                    }
                });
    
                if (!tag) {
                    res.status(400).send('Invalid ID');
                    return;
                }
    
                if (tag.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
    
                await prisma.tag.delete({
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