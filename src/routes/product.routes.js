const express = require('express');
const controller = require('../controller/product');
const passport = require('passport')

const routes = express.Router();

routes.get('', controller.products);
routes.get('/:id', controller.getById);

routes.post('', passport.authenticate('jwt', { session: false }),controller.create);
routes.patch('/:id', passport.authenticate('jwt', { session: false }),controller.update);
routes.delete('/:id', passport.authenticate('jwt', { session: false }),controller.remove);

module.exports = routes;
