import 'dotenv/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model';


export const applyPassportStrategy = passport => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    new Strategy(options, (payload, done) => {
      User.findOne({ email: payload.email }, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, { _id: user._id, email: user.email });
        return done(null, false);
      });
    })
  );
};