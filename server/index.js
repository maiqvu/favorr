// Import dependencies
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
require('dotenv').config();

// Import route handlers
import authRouter from './routes/auth.route';
import userRouter from './routes/users.route';

// Initialize an Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to database
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to database.'))
  .catch(err => console.log(`Failed to connect to database: ${err}`));

// Routing
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.listen(process.env.PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${process.env.PORT}...`);
  }
});