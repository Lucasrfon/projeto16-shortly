import { connection } from "../dbStrategy/pg.js";

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
        const {rows: validUrl} = await connection.query('SELECT * FROM urls WHERE short_url = $1', [shortUrl]);
    
        if(!validUrl[0]) {
            return res.status(404).send()
        }
    
        const visits = validUrl[0].visit_count + 1;
    
        await connection.query(`UPDATE urls SET visit_count = ${visits} WHERE short_url = '${shortUrl}'`);
    
        res.redirect(validUrl[0].original_url)
    } catch (error) {
        res.status(500).send(error)
    }
}