import { connection } from "../dbStrategy/pg.js";

export async function findEmail(email) {
    return connection.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

export async function insertNewUser(name, email, encryptedPassword) {
    return connection.query(`
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
    `, [name, email, encryptedPassword]);
}

export async function insertNewSession(id, token) {
    return connection.query(`
        INSERT INTO sessions (user_id, token) VALUES ($1, $2)
    `, [id, token]);
}