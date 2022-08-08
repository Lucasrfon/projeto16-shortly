import joi from "joi";
import { findSession } from "../repositories/authRepository.js";

export function validateNewUser(req, res, next) {
    const newUserSchema = joi.object({
        name: joi.string().pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]*$/).required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required().valid(joi.ref('password'))
    });
    const newUser = req.body;
    const validation = newUserSchema.validate(newUser, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map(each => each.message);

        return res.status(422).send(errors);
    }

    next();
}

export function validateUser(req, res, next) {
    const userSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });
    const user = req.body;
    const validation = userSchema.validate(user, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map(each => each.message);

        return res.status(422).send(errors);
    }
    
    next();
}

export function validateUrl(req, res, next) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i');
    const urlSchema = joi.object({
        url: joi.string().pattern(urlPattern).required()
    });
    const url = req.body;
    const validation = urlSchema.validate(url, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map(each => each.message);

        return res.status(422).send(errors);
    }
    
    next();
}

export async function validateToken(req, res, next) {
    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');
        const {rows: session} = await findSession(token);
    
        if (!session[0]) {
            return res.status(401).send();
        }

        res.locals.token = token;
        res.locals.user = session[0].user_id
        next();     
    } catch (error) {
        res.status(417).send(error);
    }
}