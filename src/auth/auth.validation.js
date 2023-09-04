const Joi = require("joi");
const { password } = require("../utils/custom.validation");

const register = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        username: Joi.string().required(),
        password: Joi.string().required().custom(password),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

module.exports = {
    register,
    login,
};
