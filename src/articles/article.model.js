const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const paginate = require("../utils/paginate");

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        body: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            slug: "title",
            unique: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        state: {
            type: String,
            enum: ["draft", "published"],
            required: true,
            default: "draft",
        },
        readCount: {
            type: Number,
            default: 0,
        },
        readingTime: {
            type: Number,
            default: 0,
        },
        tags: {
            type: String,
        },
        description: {
            type: String,
        },
    }
);

articleSchema.set("timestamps", true);

articleSchema.plugin(paginate);

module.exports = mongoose.model("Article", articleSchema);
