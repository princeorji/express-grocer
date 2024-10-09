const express = require('express');
const controller = require('../controller/user');

const routes = express.Router();

routes.get('/profile', controller.profile);

module.exports = routes;
