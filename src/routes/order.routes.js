const express = require('express');
const controller = require('../controller/order');

const routes = express.Router();

routes.get('', controller.orders);
routes.get('/:id', controller.getById);

module.exports = routes;
