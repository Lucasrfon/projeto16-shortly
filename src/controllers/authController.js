import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { findEmail, insertNewSession, insertNewUser } from '../repositories/authRepository.js';

export async function signUp(req, res) {
    try {
        const {name, email, password} = req.body;
        const unique = await findEmail(email);
        const encryptedPassword = bcrypt.hashSync(password, 5);

        if(unique.rowCount !== 0) {
            return res.status(409).send()
        }

        await insertNewUser(name, email, encryptedPassword);
        res.status(201).send()
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function signIn(req, res) {
    try {
        const {email, password} = req.body;
        const {rows: user} = await findEmail(email);
        const validPassword = user[0] ? bcrypt.compareSync(password, user[0].password) : null;
        const token = uuid();

        if(!user[0] || !validPassword) {
            return res.status(401).send('Email e/ou senha inválidos')
        }

        await insertNewSession(user[0].id, token); 
        res.status(200).send(token)
    } catch (error) {
        res.status(500).send(error)
    }
}