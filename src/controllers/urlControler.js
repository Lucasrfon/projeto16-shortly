import { connection } from "../dbStrategy/pg.js";

export async function getUrl(req, res) {
    const id = req.params.id;
    const {rows: validId} = await connection.query(`SELECT * FROM urls WHERE id = ${id}`);

    if(!validId[0]) {
        return res.status(404).send()
    }

    const url = {id: validId[0].id, shortUrl: validId[0].short_url, url: validId[0].original_url}

    res.status(200).send(url)
}