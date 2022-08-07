import joi from "joi";

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
        name: joi.string().pattern(/^[a-zA-Z]*$/).required(),
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