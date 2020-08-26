import bcrypt from 'bcryptjs';
import { check } from 'express-validator';

export const generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validateRegistration = [
  check('email')
    .exists().withMessage('Email cannot be empty.')
    .isEmail().withMessage('Please enter a valid email format.'),
  check('password')
    .exists().withMessage('Password cannot be empty.')
    .isLength({ min: 5 }).withMessage('Password must have at least 5 characters.')
];

export const validateLogIn = [
  check('email')
    .exists().withMessage('Email cannot be empty.'),
  check('password')
    .exists().withMessage('Password cannot be empty.')
];