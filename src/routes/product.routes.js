const express = require('express');
const controller = require('../controller/product');

const routes = express.Router();

routes.get('', controller.products);
routes.get('/:id', controller.getById);

module.exports = routes;
