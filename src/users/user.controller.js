const httpStatus = require("http-status");
const User = require("./user.model");
const userService = require("./user.service");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.user, req.body);
    res.status(httpStatus.CREATED).send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
    const user = await userService.getAllUsers(req.user);
    res.send(user);
});

const getUserByUsername = catchAsync(async (req, res) => {
    const user = await userService.getUserByUsername(req.user, req.params.username);
    res.send(user);
});

const publicGetUserByUsername = catchAsync(async (req, res) => {
    const user = await userService.publicGetUserByUsername(req.params.username);
    res.send(user);
});

const updateUserByUsername = catchAsync(async (req, res) => {
    const user = await userService.updateUserByUsername(req.user, req.params.username, req.body);
    res.send(user);
});

module.exports = {
    createUser,
    getAllUsers,
    getUserByUsername,
    publicGetUserByUsername,
    updateUserByUsername,
};
