const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        req.body = JSON.parse(req.body);
        const username = req.body.username ? req.body.username.trim() :  null;
        const password = req.body.password ? req.body.password.trim() : null;
        if (!username || !password) {
            res.status(400).send('Username and password required');
            return;
        }
        if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || /^[A-Za-z0-9]*$/.test(password)) {
            res.status(400).send('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
            return;
        }
        const db_user = await prisma.user.findUnique({where: {username}});
        if (db_user) {
            res.status(400).send('This username is taken');
            return;
        }

        try {
            bcrypt.hash(password, 10, async function(err, hash) {
                const user = await prisma.user.create({
                    data: {
                        username,
                        password: hash
                    }
                });
                delete user.password;
                const token = await jwt.sign(user, process.env.JWT_SECRET);
                res.status(200).setHeader("Set-Cookie", `token=${token}; Path=/`).json(user);
            });
        } catch (e) {
            console.log(e);
            res.status(500).send('Server Error');
        }
    } else res.status(400).send('Bad Request');
}