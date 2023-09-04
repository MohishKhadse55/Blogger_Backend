const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Users = require("./user.model");

const isEmailTaken = async function (email) {
    const user = await Users.findOne({ email });
    return !!user;
};

const isUsernameTaken = async function (username) {
    const user = await Users.findOne({ username });
    return !!user;
};

const createUser = async (user, userBody) => {
    if (user.role !== "admin") {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    if (await isUsernameTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
    }

    const newUser = await Users.create(userBody);
    return newUser;
};

const getAllUsers = async (user, filter, options) => {
    if (user.role !== 'admin') {
    	throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const users = await Users.find();

    return users;
};

const getUserByUsername = async (loggedinUser, username) => {
    const user = await Users.findOne({
        username: { $regex: username, $options: "i" },
    }).populate('articles');

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.username !== loggedinUser.username) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized");
    }

    return user;
};

const publicGetUserByUsername = async (username) => {
    const user = await Users.findOne({
        username: { $regex: username, $options: "i" },
    })
        .select("-password")
        .select("-role")
        .populate({
            path: "articles",
            match: { state: "published" },
        });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    return user;
};

const updateUserByUsername = async (user, username, userBody) => {
    let userToUpdate = await getUserByUsername(username);

    if (user.username !== userToUpdate[0].username) {
        throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized");
    }
    
    userToUpdate = await Users.findOneAndUpdate(
        { username: { $regex: username, $options: "i" } },
        userBody,
        { returnDocument: "after" }
    );

    return userToUpdate;
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByUsername,
    publicGetUserByUsername,
    updateUserByUsername,
};
