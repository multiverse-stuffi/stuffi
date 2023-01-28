const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const username = req.body.username ?? '';
        const password = req.body.password ?? '';
        if (!username.trim() || !password.trim()) {
            res.status(400).send('Username and password required');
            return;
        }
        if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
            res.status(400).send('Password must be at least 8 characters and contain uppercase, lowercase, and a number');
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
                const token = await jwt.sign(user, process.env.NEXT_PUBLIC_JWT_SECRET);
                res.status(200).setHeader("Set-Cookie", `token=${token}`).send('success');
            });
        } catch (e) {
            res.status(500).send('Server Error');
        }
    }
}