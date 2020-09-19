import 'dotenv/config';
import express from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { generateHashedPassword, validateRegistration, validateLogIn } from '../utils/auth';

const usersRouter = express.Router();

const createUser = async (email, password) => {
  const data = {
    email,
    hashedPassword: await generateHashedPassword(password)
  };
  return new User(data).save();
};


usersRouter.post('/register', validateRegistration, async (req, res) => {
  console.log(req.body);
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    res.status(400).json({ message: errorsAfterValidation.mapped() });
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


usersRouter.post('/login', validateLogIn, async (req, res) => {
  const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
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


export default usersRouter;
