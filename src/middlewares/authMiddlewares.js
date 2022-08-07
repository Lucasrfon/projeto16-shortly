import joi from "joi";
import { connection } from "../dbStrategy/pg.js";

export function validateNewUser(req, res, next) {
    const newUserSchema = joi.object({
        name: joi.string().pattern(/^[a-zA-Z]*$/).required(),
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

export async function validateToken(req, res, next) {
    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer ', '');
        const {rows: session} = await connection.query('SELECT * FROM sessions WHERE token = $1',
        [token]);
    
        if (!session[0]) {
            return res.status(401).send();
        }

        res.locals.token = token;
        next();     
    } catch (error) {
        res.status(417).send(error);
    }
}