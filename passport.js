import passport from "passport";
import GoogleStrategy from 'passport-google-oauth2';


passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});
  
passport.use(new GoogleStrategy({
    clientID:"114049326693-r0ct5m6ggo3g0fdatpttr9r2oamcdvti.apps.googleusercontent.com", // Your Credentials here.
    clientSecret:"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", // Your Credentials here.
    callbackURL:"http://localhost:5000/auth/callback",
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));