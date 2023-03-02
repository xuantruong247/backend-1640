const Joi = require('@hapi/joi')
 
//-- Validation
//Register
const createValidation = data =>{
    const accountSchema = Joi.object({
        username: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .min(6)
            .required()
            .email()
        });
    return accountSchema.validate(data)
}
//Login
const loginValidation = data =>{
    const accountSchema = Joi.object({
        username: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required()
        });
    return accountSchema.validate(data)
}

module.exports.createValidation = createValidation;
module.exports.loginValidation = loginValidation;
