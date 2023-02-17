const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        req.body = JSON.parse(req.body);
        const username = req.body.username ? req.body.username.trim() :  null;
        const password = req.body.password ? req.body.password.trim() : null;
        if (!username || !password) {
            res.status(400).send('Username and password required');
            return;
        }
        const user = await prisma.user.findUnique({where: {username}});
        if (user) {
            bcrypt.compare(password, user.password, async function(err, result) {
                if (result) {
                    delete user.password;
                    const token = await jwt.sign(user, process.env.JWT_SECRET);
                    res.status(200).setHeader("Set-Cookie", `token=${token}; Path=/`).json(user);
                } else res.status(400).send('No user found with this username/password combination');
            });
        } else res.status(400).send('No user found with this username/password combination');
    } else res.status(400).send('Bad Request');
}