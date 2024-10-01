const express = require('express');
const controller = require('../controller/cart');

const routes = express.Router();

routes.post('', controller.addToCart);

routes.get('', controller.cart);

routes.delete('/:id', controller.removeCartItem);

module.exports = routes;
