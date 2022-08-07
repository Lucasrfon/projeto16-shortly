import { connection } from "../dbStrategy/pg.js";

export async function ranking(req, res) {
    try {
        const {rows: rank} = await connection.query(`
            SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", SUM(visit_count) AS "visitCount"
            FROM users
            JOIN urls
            ON users.id = urls.user_id
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10
        `)

        res.status(200).send(rank)
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function getUserUrls(req, res) {
    try {
        const userId = res.locals.user;
        const {rows: userUrls} = await connection.query(`
            SELECT users.id, users.name, SUM(visit_count) AS "visitCount"
            FROM users
            JOIN urls
            ON users.id = urls.user_id
            WHERE users.id = ${userId}
            GROUP BY users.id
        `)

        if(!userUrls[0]) {
            return res.status(404).send()
        }

        res.status(200).send(userUrls[0])
    } catch (error) {
        res.status(500).send(error)
    }
}