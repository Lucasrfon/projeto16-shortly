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
            SELECT users.id AS user_id, users.name, urls.id, urls.short_url AS shortUrl, original_url AS url, urls.visit_count
            FROM users
            JOIN urls
            ON users.id = urls.user_id
            WHERE users.id = ${userId}
        `)

        if(!userUrls[0]) {
            return res.status(404).send()
        }

        let visitCount = 0;
        const shortenedUrls = [];
        for(let i = 0; i < userUrls.length; i++) {
            visitCount += userUrls[i].visit_count;
            shortenedUrls.push({
                id: userUrls[i].id,
                shorturl: userUrls[i].shorturl,
                url: userUrls[i].url,
                visit_count: userUrls[i].visit_count
            })
        }
        
        const formatUserUrls = {
            id: userUrls[0].user_id,
            name: userUrls[0].name,
            visitCount,
            shortenedUrls
        }

        res.status(200).send(formatUserUrls)
    } catch (error) {
        res.status(500).send(error)
    }
}