import connection from "../dbStrategy/pg.js";

export async function insertUrl(url, shortUrl, userId) {
    return connection.query(`
        INSERT INTO urls (original_url, short_url, user_id)
        VALUES ($1, $2, $3)
    `, [url, shortUrl, userId])
}

export async function findUser(id) {
    return connection.query('SELECT * FROM urls WHERE id = $1', [id])
}

export async function findUrl(shortUrl) {
    return connection.query('SELECT * FROM urls WHERE short_url = $1', [shortUrl])
}

export async function updateViews(visits, shortUrl) {
    return connection.query(`
        UPDATE urls SET visit_count = $1 WHERE short_url = $2
    `, [visits, shortUrl])
}

export async function findUrlOwner(id) {
    return connection.query(`
        SELECT sessions.token
        FROM users
        JOIN sessions
        ON users.id = sessions.user_id
        JOIN urls
        ON users.id = urls.user_id
        WHERE urls.id = $1        
    `, [id])
}

export async function removeUrl(id) {
    return connection.query('DELETE FROM urls WHERE id = $1', [id])
}