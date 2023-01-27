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
        const user = await prisma.user.findUnique({where: {username}});
        if (user) {
            bcrypt.compare(password, user.password, async function(err, result) {
                if (result) {
                    delete user.password;
                    const token = await jwt.sign(user, process.env.NEXT_PUBLIC_JWT_SECRET);
                    res.status(200).setHeader("Set-Cookie", `token=${token}`).send('success');
                } else res.status(400).send('No user found with this username/password combination');
            });
        } else res.status(400).send('No user found with this username/password combination');
    }
}