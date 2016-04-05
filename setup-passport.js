var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var strategy = new Auth0Strategy({
    domain:       'app49113115.auth0.com',
    clientID:     'rAr4pX85zt3P3DvCgcXqAAvYEIWPxT2T',
    clientSecret: '4dzGxta9GiuzzN0q5IOiix1hBG-e8OnZzbJz4MrKb93D7QnfpTHAof-JAjLjlkA8',
    callbackURL:  'https://dry-thicket-81721.herokuapp.com/video.html'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = strategy;