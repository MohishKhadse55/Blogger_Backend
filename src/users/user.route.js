const express = require('express');
const validate = require('../middleware/validate');
const protect = require("../middleware/auth");
const router = express.Router();
const userController = require('./user.controller');
const userValidation = require('./user.validation')

router
  .route('/')
  .post(protect, validate(userValidation.createUser), userController.createUser)
  .get(protect, userController.getAllUsers);

router
  .route('/:username')
  .get(protect, validate(userValidation.getUser), userController.getUserByUsername)
  .patch(protect, validate(userValidation.updateUser), userController.updateUserByUsername);

  router
  .route('/p/:username')
  .get(validate(userValidation.getUser), userController.publicGetUserByUsername);

module.exports = router;
