const Joi = require("joi");
const { password } = require("../utils/custom.validation");

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        username: Joi.string().required(),
        password: Joi.string().required().custom(password),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
    }),
};

const getUser = {
    params: Joi.object().keys({
        username: Joi.string().required(),
    })
}

const updateUser = {
    params: Joi.object().keys({
        username: Joi.string().required(),
    }),
    body: Joi.object().keys({
        firstname: Joi.string(),
        lastname: Joi.string(),
    }).min(1),
};

module.exports = {
    getUser,
    createUser,
    updateUser
};
