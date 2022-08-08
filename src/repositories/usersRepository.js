import { connection } from "../dbStrategy/pg.js";

export async function getRanking() {
    return connection.query(`
        SELECT users.id, users.name, COUNT(urls.id) AS "linksCount", SUM(visit_count) AS "visitCount"
        FROM users
        JOIN urls
        ON users.id = urls.user_id
        GROUP BY users.id
        ORDER BY "visitCount" DESC
        LIMIT 10
    `)
}

export async function findUserUrls(userId) {
    return connection.query(`
        SELECT users.id AS user_id, users.name, urls.id, urls.short_url AS shortUrl, original_url AS url, urls.visit_count
        FROM users
        JOIN urls
        ON users.id = urls.user_id
        WHERE users.id = $1
    `, [userId])
}