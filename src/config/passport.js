const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const env = require('../utils/venv');
const User = require('../models/user');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    try {
      const user = User.findOne({ id: jwt_payload._id });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  }),
);
