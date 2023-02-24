const jwt = require('jsonwebtoken');
import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        req.body = JSON.parse(req.body);
        const value = isNaN(req.body.value) ? null : Number(req.body.value);

        if (isNaN(req.query.id) || !req.query.id || isNaN(req.query.tagId) || !req.query.tagId) {
            res.status(400).send('Invalid ID(s)');
            return;
        }
        const itemId = Number(req.query.id);
        const tagId = Number(req.query.tagId);

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            try {
                const db_itemTag = await prisma.itemTag.findFirst({
                    where: {
                        itemId,
                        tagId
                    }
                });
                if (db_itemTag) {
                    res.status(400).send('Already exists');
                    return;
                }
                const db_item = await prisma.item.findUnique({
                    where: {
                        id: itemId
                    }
                });
                if (!db_item) {
                    res.status(400).send('Invalid Item ID');
                    return;
                }
                if (db_item.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const db_tag = await prisma.tag.findUnique({
                    where: {
                        id: tagId
                    }
                });
                if (!db_tag) {
                    res.status(400).send('Invalid Item ID');
                    return;
                }
                if (db_tag.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const itemTag = await prisma.itemTag.create({
                    data: {
                        itemId,
                        tagId,
                        value
                    }
                });
                res.status(200).json(itemTag);
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
        else res.status(403).send('Not Authorized');
    } else if (req.method === 'PUT') {
        req.body = JSON.parse(req.body);
        const value = isNaN(req.body.value) ? null : Number(req.body.value);

        if (isNaN(req.query.id) || !req.query.id || isNaN(req.query.tagId) || !req.query.tagId) {
            res.status(400).send('Invalid ID(s)');
            return;
        }
        const itemId = Number(req.query.id);
        const tagId = Number(req.query.tagId);

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            try {
                const db_itemTag = await prisma.itemTag.findFirst({
                    where: {
                        itemId,
                        tagId
                    }
                });
                if (!db_itemTag) {
                    res.status(400).send('Does not exist');
                    return;
                }
                const db_item = await prisma.item.findUnique({
                    where: {
                        id: itemId
                    }
                });
                if (!db_item) {
                    res.status(400).send('Invalid Item ID');
                    return;
                }
                if (db_item.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const db_tag = await prisma.tag.findUnique({
                    where: {
                        id: tagId
                    }
                });
                if (!db_tag) {
                    res.status(400).send('Invalid Item ID');
                    return;
                }
                if (db_tag.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const itemTag = await prisma.itemTag.update({
                    data: {
                        value
                    },
                    where: {
                        id: db_itemTag.id
                    }
                });
                res.status(200).json(itemTag);
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
    } else if (req.method === 'GET') {
        if (isNaN(req.query.id) || !req.query.id || isNaN(req.query.tagId) || !req.query.tagId) {
            res.status(400).send('Invalid ID(s)');
            return;
        }
        const itemId = Number(req.query.id);
        const tagId = Number(req.query.tagId);

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            try {
                const db_itemTag = await prisma.itemTag.findFirst({
                    where: {
                        itemId,
                        tagId
                    },
                    include: {
                        Item: {
                            select: {
                                userId: true
                            }
                        }
                    }
                });
                if (!db_itemTag) {
                    res.status(400).send('Invalid ID(s)');
                    return;
                }
                if (db_itemTag.Item.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                delete db_itemTag.Item;
                res.status(200).json(db_itemTag);
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
    } else if (req.method === 'DELETE') {
        if (isNaN(req.query.id) || !req.query.id || isNaN(req.query.tagId) || !req.query.tagId) {
            res.status(400).send('Invalid ID(s)');
            return;
        }
        const itemId = Number(req.query.id);
        const tagId = Number(req.query.tagId);

        if (req.cookies.token) await jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function (err, decoded) {
            try {
                const db_itemTag = await prisma.itemTag.findFirst({
                    where: {
                        itemId,
                        tagId
                    },
                    include: {
                        Item: {
                            select: {
                                userId: true
                            }
                        }
                    }
                });
                if (!db_itemTag) {
                    res.status(400).send('Invalid ID(s)');
                    return;
                }
                if (db_itemTag.Item.userId !== decoded.id) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                await prisma.itemTag.delete({
                    where: {
                        id: db_itemTag.id
                    }
                })
                res.status(200).send('success');
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
    }
}