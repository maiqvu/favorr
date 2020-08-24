// Import dependencies
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';


// Import route handlers
import users from './routes/users.route';
import requestRouter from './routes/publicRequest.route';


// Initialize an Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(passport.initialize());
require('./utils/passport')(passport);


// Connect to database
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to database.'))
  .catch(err => console.log(`Failed to connect to database: ${err}`));


// Routing
app.use('/api/users', users);
app.use('/api/publicRequest', requestRouter);


// Start the Express server
app.listen(process.env.PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${process.env.PORT}...`);
  }
});