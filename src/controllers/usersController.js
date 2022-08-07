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