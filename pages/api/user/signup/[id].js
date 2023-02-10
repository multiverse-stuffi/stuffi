const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const oldPassword = req.body.oldPassword ? req.body.oldPassword.trim() : null;
        const newPassword = req.body.newPassword ? req.body.newPassword.trim() : null;
        let queryId = 0;

        if (isNaN(req.query.id)) {
            res.status(400).send('ID must be a number');
            return;
        } else queryId = Number(req.query.id);

        if (!newPassword || !oldPassword) {
            res.status(400).send('Passwords cannot be blank');
            return;
        }
        if (newPassword === oldPassword) {
            res.status(400).send('New password cannot be the same as the old');
            return;
        }
        if (newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || /^[A-Za-z0-9]*$/.test(password)) {
            res.status(400).send('New password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
            return;
        }
        if (req.cookies.token) jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, decoded) {
            try {
                const id = decoded.id;
                if (id !== queryId) {
                    res.status(403).send('Not Authorized');
                    return;
                }
                const user = await prisma.user.findUnique({where: {id}});
                if (user) {
                    bcrypt.compare(oldPassword, user.password, async function(err, result) {
                        if (result) {
                            bcrypt.hash(newPassword, 10, async function(err, hash) {
                                const user = await prisma.user.update({
                                    data: {
                                        password: hash
                                    },
                                    where: {
                                        id
                                    }
                                });
                                res.status(200).send('success');
                            });
                        } else res.status(400).send('Incorrect password');
                    });
                } else res.status(400).send('User not found');
            } catch (e) {
                console.log(e);
                res.status(500).send('Server Error');
            }
        });
        else res.status(403).send('Not Authorized');
    } else res.status(400).send('Bad Request');
}