const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Users = require("../users/user.model");

const isEmailTaken = async function (email) {
    const user = await Users.findOne({ email });
    return !!user;
};

const isUsernameTaken = async function (username) {
    const user = await Users.findOne({ username });
    return !!user;
};

const register = async (userBody) => {
    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
    }

    if (await isUsernameTaken(userBody.username)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
    }

    const user = await Users.create(userBody);
    const token = user.createJWT();
    return { user, token };
};

const login = async (userBody) => {
    const user = await Users.findOne({ email: userBody.email });

    if (
        !user ||
        !(await user.comparePassword(userBody.password, user.password))
    ) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            "Incorrect email or password"
        );
    }
    const token = user.createJWT();

    return { user, token };
};



module.exports = {
    register,
    login,
};
