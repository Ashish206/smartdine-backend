const express = require('express');
const authRoute = require('./auth.routes');
const categoryRoute = require('./category.routes');
const menuRoute = require('./menu.routes');
const tableRoute = require('./table.routes');
const settingsRoute = require('./settings.routes');
const customerRoute = require('./customerMenu.routes');
const orderRoute = require('./order.routes');
const kitchenUserRoute = require('./kitchen.user.routes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/menu',
    route: menuRoute,
  },
  {
    path: '/table',
    route: tableRoute,
  },
  {
    path: '/settings',
    route: settingsRoute,
  },
  {
    path: '/customer',
    route: customerRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
  {
    path: '/kitchen-user',
    route: kitchenUserRoute,
  },
];

// Register all routes
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
