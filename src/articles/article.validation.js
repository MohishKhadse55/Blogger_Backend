const Joi = require("joi");

const createArticle = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        body: Joi.string().required(),
        description: Joi.string(),
        tags: Joi.string(),
    }),
};

const getArticleBySlug = {
    params: Joi.object().keys({
        slug: Joi.string().required(),
    }),
};

const updateArticleBySlug = {
    params: Joi.object().keys({
        slug: Joi.string().required(),
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            body: Joi.string(),
            description: Joi.string(),
            tags: Joi.string(),
        })
        .min(1),
};

const updateArticleState = {
    params: Joi.object().keys({
        slug: Joi.string().required(),
        state: Joi.string().required().valid("draft", "published"),
    }),
};

const deleteArticleBySlug = {
    params: Joi.object().keys({
        slug: Joi.string().required(),
    }),
};

module.exports = {
    createArticle,
    getArticleBySlug,
    updateArticleBySlug,
    updateArticleState,
    deleteArticleBySlug
};
