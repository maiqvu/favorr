import 'dotenv/config';
import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { generateHashedPassword, validateRegistration, validateLogIn } from '../utils/auth';

const usersRouter = express.Router();

const createUser = async (name, email, password) => {
  const data = {
    name,
    email,
    hashedPassword: await generateHashedPassword(password)
  };
  return new User(data).save();
};

usersRouter.post('/register', validateRegistration, async (req, res) => {
  console.log(req.body);
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    //return res.status(400).json({ message: errorsAfterValidation.mapped() });
    res.status(400).json({message: isValid.array()})
  }

  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      res.status(403).json({ message: 'An account already exists for this email address.' });
    } else {
      await createUser(name, email, password);

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
      // I use the delete operator instead of reassigning hashedPassword to null because I want to completely remove/unmask it from the dataToReturn object (causing hasOwnProperty or for(...in...) to not record the hashedPassword property as existing in dataToReturn).
      res.status(201).json( dataToReturn );
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});   // end of .post('/register')


usersRouter.post('/login', validateLogIn, async (req, res) => {
  const isValid = validationResult(req);
  if (!isValid.isEmpty()) {
    res.status(400).json({ message: errorsAfterValidation.mapped() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.email) {
      const validatePassword = await bcrypt.compare(password, user.hashedPassword);
      if (validatePassword) {
        // Sign a token
        const token = jwt.sign(
          { email },
          process.env.JWT_SECRET,
          { expiresIn: 3600 }
        );

        // Return a sanitized user object and the signed token back to client
        const dataToReturn = { ...user.toJSON(), ...{ token } };
        delete dataToReturn.hashedPassword;
        res.status(200).json( dataToReturn );
      } else {
        res.status(401).json({ message: 'Wrong password.' });
      }
    } else {
      res.status(404).json({ message: 'User not found. Please register a new account.' });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
});   // end of .post('/login')


export default usersRouter;