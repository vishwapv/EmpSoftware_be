let users = require('./users/index');
let profile = require('./profile/index');
exports.addAPI = function (mount, app, passport, cache) {
  app.use(mount + '/users', users(passport));
  app.use(mount + '/profile', profile(passport));
};
