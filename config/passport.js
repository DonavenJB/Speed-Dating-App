const LocalStrategy = require('passport-local').Strategy;
const User = require('/home/user1/VS_Workspace/speed-dating-application/src/models/User.js');

module.exports = (passport) => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log('[passport.js] User not found');
        return done(null, false);
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('[passport.js] Invalid password');
        return done(null, false);
      }
      console.log('[passport.js] User authenticated');
      return done(null, user);
    } catch (err) {
      console.error('[passport.js] Error:', err.message);
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
