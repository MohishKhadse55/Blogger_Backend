const User = require("../users/user.model");
const authService = require("./auth.service");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(httpStatus.CREATED).send(user);
});

const login = catchAsync(async (req, res) => {
    const user = await authService.login(req.body);
    res.status(httpStatus.OK).send(user);
});


module.exports = {
    register,
    login,
};
