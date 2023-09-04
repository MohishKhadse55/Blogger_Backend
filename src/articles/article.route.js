const express = require("express");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const router = express.Router();
const articleController = require("./article.controller");
const articleValidation = require("./article.validation");

router
    .route("/")
    .post(
        protect,
        validate(articleValidation.createArticle),
        articleController.createArticle
    )
    .get(articleController.getAllArticles);

router
    .route("/:slug")
    .get(
        validate(articleValidation.getArticleBySlug),
        articleController.getArticleBySlug
    )
    .patch(
        protect,
        validate(articleValidation.updateArticleBySlug),
        articleController.updateArticleBySlug
    )
    .delete(
        protect,
        validate(articleValidation.deleteArticleBySlug),
        articleController.deleteArticle
    );

router
    .route("/:slug/:state")
    .patch(
        protect,
        validate(articleValidation.updateArticleState),
        articleController.updateArticleState
    );

module.exports = router;
