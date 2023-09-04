const express = require('express');
const config = require('./src/config/config');
const morgan = require('./src/config/morgan');
const passport = require('passport');
const { errorConverter, errorHandler } = require('./src/middleware/error');
const articleRoute = require('./src/articles/article.route');
const authRoute = require('./src/auth/auth.route');
const userRoute = require('./src/users/user.route');
require('./src/config/passport');

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
  }
app.use(express.json());
app.use(passport.initialize());

app.use('/articles', articleRoute);
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.get('/', (req, res) => {
    res.send({message: "Mohish Khadse"})
})
app.use('*', (req, res) => {
    res.send({message: "Route Not found"})
})

app.use(errorConverter);

app.use(errorHandler);

module.exports = app;

