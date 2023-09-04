const httpStatus = require("http-status");
const logger = require("../config/logger");
const userModel = require("../users/user.model");
const ApiError = require("../utils/ApiError");
const Articles = require("./article.model");

const isTitleTaken = async function (title) {
    const article = await Articles.findOne({ title });
    return !!article;
};

const calculateReadingTime = (lengthOfArticle) => {
    const wordsPerMinute = 180;
    const readingTime = Math.ceil(lengthOfArticle / wordsPerMinute);
    return readingTime;
};

const getAllArticles = async (filter, options) => {
    const articles = await Articles.paginate(filter, options);

    return articles;
};

const createArticle = async (user, articleBody) => {
    if (await isTitleTaken(articleBody.title)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Title is taken");
    }

    const newArticle = {
        ...articleBody,
        author: user._id,
        state: 'published',
        readingTime: calculateReadingTime(
            articleBody.body.match(/(\w+)/g).length
        ),
    };
    const article = await Articles.create(newArticle);
    
    const { _id } = article._doc;

    await userModel.findByIdAndUpdate(user._id, {$push: {articles: _id}});

    return article;
};

const getArticleBySlug = async (slug) => {
    let article = await Articles.findOne({ slug, state: "published" });

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    return updateArticleReadCount(slug, article);
};

const updateArticleReadCount = async (slug, article) => {
    const articleToUpdate = await Articles.findOneAndUpdate(
        { slug },
        {
            readCount: ++article.readCount,
        },
        { returnDocument: "after" }
    ).populate({
        path: 'author',
        select: '-_id -password -role -__v'
    });

    return articleToUpdate;
};

const updateArticleBySlug = async (user, slug, articleBody) => {
    let article = await Articles.findOne({ slug }).populate({
        path: 'author',
        select: '-_id -password -role -__v'
    });

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user.username !== article.author.username) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    if (articleBody.body) {
        articleBody.readingTime = calculateReadingTime(
            articleBody.body.match(/(\w+)/g).length
        );
    }

    article = await Articles.findOneAndUpdate({ slug }, articleBody, {
        returnDocument: "after",
        runValidators: true,
    });

    return article;
};

const updateArticleState = async (user, slug, state) => {
    let article = await Articles.findOne({ slug }).populate({
        path: 'author',
        select: '-_id -password -role -__v'
    });

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user.username !== article.author.username && user.role !== "admin") {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    article = await Articles.findOneAndUpdate(
        { slug },
        { state },
        { returnDocument: "after" }
    );

    return article;
};

const deleteArticle = async (user, slug) => {
    const article = await Articles.findOne({ slug }).populate({
        path: 'author',
        select: '-_id -password -role -__v'
    });

    if (!article) {
        throw new ApiError(httpStatus.NOT_FOUND, "Article not found");
    }

    if (user.username !== article.author.username && user.role !== "admin") {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    await Articles.findOneAndDelete({ slug });
    return;
};

module.exports = {
    createArticle,
    getAllArticles,
    getArticleBySlug,
    updateArticleBySlug,
    updateArticleState,
    deleteArticle,
};
