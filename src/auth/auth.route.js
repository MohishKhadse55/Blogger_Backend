const express = require('express');
const validate = require('../middleware/validate');
const router = express.Router();
const authController = require('./auth.controller');
const authValidation = require('./auth.validation')

router.route('/register').post(validate(authValidation.register), authController.register);

router.route('/login').post(validate(authValidation.login), authController.login);

module.exports = router;
