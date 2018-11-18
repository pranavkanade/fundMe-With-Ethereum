const routes = require("next-routes")();

routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:address", "/campaigns/show")
  .add("/campaigns/:address/requests", "/requests/")
  .add("/campaigns/:address/requests/new", "/requests/new");
module.exports = routes;
