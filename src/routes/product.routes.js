const express = require('express');
const controller = require('../controller/product');

const routes = express.Router();

routes.post('', controller.create);
routes.get('', controller.products);
routes.get('/:id', controller.getById);
routes.patch('/:id', controller.update);
routes.delete('/:id', controller.remove);

module.exports = routes;
