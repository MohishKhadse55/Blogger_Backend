const httpStatus = require("http-status");
const articleService = require("./article.service");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");

const getAllArticles = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["state", "author"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);

    const articles = await articleService.getAllArticles(filter, options);

    res.send(articles);
});

const createArticle = catchAsync(async (req, res) => {
    const article = await articleService.createArticle(req.user, req.body);
    
    res.status(httpStatus.CREATED).send(article);
});

const getArticleBySlug = catchAsync(async (req, res) => {
    const article = await articleService.getArticleBySlug(req.params.slug);
    
    res.send(article);
});

const updateArticleBySlug = catchAsync(async (req, res) => {
    const article = await articleService.updateArticleBySlug(
        req.user,
        req.params.slug,
        req.body
    );
    res.send(article);
});

const deleteArticle = catchAsync(async (req, res) => {
    await articleService.deleteArticle(req.user, req.params.slug);
    res.status(httpStatus.NO_CONTENT).send();
});

const updateArticleState = catchAsync(async (req, res) => {
    const article = await articleService.updateArticleState(
        req.user,
        req.params.slug,
        req.params.state
    );
    res.send(article);
});

module.exports = {
    createArticle,
    getAllArticles,
    getArticleBySlug,
    updateArticleBySlug,
    updateArticleState,
    deleteArticle,
};
