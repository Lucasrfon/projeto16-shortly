import { nanoid } from 'nanoid';
import { findUrl, findUrlOwner, findUser, insertUrl, removeUrl, updateViews } from "../repositories/urlsRepository.js";

export async function creatShortUrl(req, res) {
    try {
        const userId = res.locals.user;
        const { url } = req.body;
        const shortUrl = nanoid();

        await insertUrl(url, shortUrl, userId);
        res.status(201).send({shortUrl})
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function getUrl(req, res) {
    try {
        const id = req.params.id;
        const {rows: validId} = await findUser(id);
    
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
        const {rows: validUrl} = await findUrl(shortUrl);
    
        if(!validUrl[0]) {
            return res.status(404).send()
        }
        const visits = validUrl[0].visit_count + 1;

        await updateViews(visits, shortUrl);
        res.redirect(validUrl[0].original_url)
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function deleteUrl(req, res) {
    try {
        const token = res.locals.token;
        const id = req.params.id;
        const {rows: validUrl} = await findUrlOwner(id);
        const urlOwner = validUrl.map(each => each.token);
        
        if(!validUrl[0]) {
            return res.status(404).send()
        }
        if(!urlOwner.includes(token)) {
            return res.status(401).send()
        }

        await removeUrl(id);
        res.status(204).send()
    } catch (error) {
        res.status(500).send(error)
    }
}