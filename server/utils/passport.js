import 'dotenv/config';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.model';

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};


// Middleware for authentication strategy
passport.use(new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
  },
  (payload, done) => {
    User.findById({_id: payload.sub}, (err, user) => {
      if (err) return done(err, false);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }
));

// Middleware for authorization
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({username}, (err, user) => {
    // Something wrong with the database
    if (err) return done(err);
    
    // If no user exists
    if (!user) return done(null, false);
    
    // If user exists, verify if password is correct
    user.comparePassword(password, done);
  });
}));
