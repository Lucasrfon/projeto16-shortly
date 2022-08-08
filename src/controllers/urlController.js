import { connection } from "../dbStrategy/pg.js";
import { nanoid } from 'nanoid';

export async function creatShortUrl(req, res) {
    try {
        const userId = res.locals.user;
        const { url } = req.body;
        const shortUrl = nanoid();

        await connection.query(`
            INSERT INTO urls (original_url, short_url, user_id)
            VALUES ($1, $2, $3)
        `, [url, shortUrl, userId])

        res.status(201).send({shortUrl})
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function getUrl(req, res) {
    try {
        const id = req.params.id;
        const {rows: validId} = await connection.query('SELECT * FROM urls WHERE id = $1', [id]);
    
        if(!validId[0]) {
            return res.status(404).send()
        }
    
        const url = {id: validId[0].id, shortUrl: validId[0].short_url, url: validId[0].original_url}
    
        res.status(200).send(url)
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function accessUrl(req, res) {
    try {
        const shortUrl = req.params.shortUrl;
        const {rows: validUrl} = await connection.query(`
            SELECT * FROM urls WHERE short_url = $1
        `, [shortUrl]);
    
        if(!validUrl[0]) {
            return res.status(404).send()
        }
    
        const visits = validUrl[0].visit_count + 1;
    
        await connection.query(`
            UPDATE urls SET visit_count = $1 WHERE short_url = $2
        `, [visits, shortUrl]);
    
        res.redirect(validUrl[0].original_url)
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function deleteUrl(req, res) {
    try {
        const token = res.locals.token;
        const id = req.params.id;
        const {rows: validUrl} = await connection.query(`
            SELECT sessions.token
            FROM users
            JOIN sessions
            ON users.id = sessions.user_id
            JOIN urls
            ON users.id = urls.user_id
            WHERE urls.id = $1        
        `, [id]);
        const urlOwner = validUrl.map(each => each.token);
        
        if(!validUrl[0]) {
            return res.status(404).send()
        }

        if(!urlOwner.includes(token)) {
            return res.status(401).send()
        }

        await connection.query('DELETE FROM urls WHERE id = $1', [id])

        res.status(204).send()
    } catch (error) {
        res.status(500).send(error)
    }
}