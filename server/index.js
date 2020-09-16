// Import dependencies
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import route handlers
import usersRouter from './routes/users.route';
import requestRouter from './routes/publicRequest.route';
import favorsRouter from './routes/favors.route';


// Initialize an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to database
mongoose
  .connect(process.env.MONGODB_URI, 
    { useNewUrlParser: true, 
      useCreateIndex: true, 
      useUnifiedTopology: true, 
      useFindAndModify: false })
  .then(() => console.log('Successfully connected to database.'))
  .catch(err => console.log(`Failed to connect to database: ${err}`));


// Routing
app.use('/api/users', usersRouter);
app.use('/api/publicRequest', requestRouter);
app.use('/api/favors', favorsRouter);


// Start the Express server
app.listen(process.env.PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${process.env.PORT}...`);
  }
});
