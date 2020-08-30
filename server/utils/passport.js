import 'dotenv/config';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model';


export const applyPassportStrategy = passport => {
  passport.use(new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await User.findOne({ email: payload.email })

        // If user doesn't exist, handle it
        if (!user) return done(null, false);

        // Otherwise, return the user object
        done(null, { _id: user._id, email: user.email });
      } catch (err) {
        done(err, false);
      }
    }
  ));
};