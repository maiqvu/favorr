import 'dotenv/config';
import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import User from '../models/user.model';
import { generateHashedPassword, validateRegistrationInput } from '../utils/auth';

const usersRouter = express.Router();

const passportConfig = require('../utils/passport');

const createUser = async (email, password) => {
  const data = {
    email,
    hashedPassword: await generateHashedPassword(password)
  };
  return new User(data).save();
};


usersRouter.post('/register', validateRegistrationInput, async (req, res) => {
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    res.status(400).json({message: isValid.array()})
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.status(403).json({ message: 'An account already exists for this email address.' });
    } else {
      await createUser(email, password);

      // Sign a token
      const newUser = await User.findOne({ email });
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: 3600 }
      );

      // Return a sanitized user object and the signed token back to client
      const dataToReturn = { ...newUser.toJSON(), ...{ token } };
      delete dataToReturn.hashedPassword;
      res.status(201).json( dataToReturn );
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});   // end of .post('/register')


const signToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

usersRouter.post(
  '/login',
  passport.authenticate('local', {session: false}),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username } = req.user;
      const token = signToken(_id);
      res.cookie('access_token', token, {maxAge: 360000, httpOnly: true, sameSite: true});
      res.status(200).json({
        isAuthenticated: true,
        user: { _id, username }
      });
    }
  }
);   // end of .post('/login')


usersRouter.patch('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    const dataToReturn = { ...updatedUser.toJSON() };
    delete dataToReturn.hashedPassword;
    res.status(200).json(dataToReturn);
  } catch (err) {
    res.status(500).send(err);
  }
});


usersRouter.get(
  '/isAuthenticated',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (req.user.username) {
      res.status(200).json({ 
        isAuthenticated: true,
        user: { 
          username: req.user.username,
          _id: req.user._id
        }
      });
    }
  }
);

usersRouter.get(
  '/logout', (req,res) => {
    res.clearCookie('access_token'),
    res.status(200).json({
      isAuthenticated: false,
        user: {}
    })
  }
)

// Get all users if no condition attached OR find by username if username is passed as query string from request
usersRouter.get('/' , async (req, res) => {
  const { username } = req.query;
  const condition = username ?
    { username: {$regex: new RegExp(username), $options: "i"} } 
    :
    {};
  await User.find(condition)
    .then(data => {
      // 'data' is an array of all matches. If more than 1 match found, ask the user to search a full accurate username. Note: all usernames in the system are unique.
      if (data.length === 1) {
        const dataToReturn = { ...data[0].toJSON() };
        delete dataToReturn.hashedPassword;
        res.status(200).json(dataToReturn);
      } else {
        res.status(500).json({ message: 'Please enter an accurate username.' });
      }
    })
    .catch(err => res.status(500).send(err));
});

export default usersRouter;
