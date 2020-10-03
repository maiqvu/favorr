import 'dotenv/config';
import express from 'express';
// import jwt from 'jsonwebtoken';
import Favor from '../models/favor.model';
import User from '../models/user.model';

const favorsRouter = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/')
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

const upload = multer({storage: storage});


// Create a new favor
favorsRouter.post('/', async (req, res) => {
  // const token = req.headers.token;
  
  if (!req.body.description || !req.body.owedBy || !req.body.owedTo) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  }

  try {
    // const legit = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(`JWT verification result: ${JSON.stringify(legit)}`);
    
    const owedByUser = await User.findOne({ username: req.body.owedBy });
    const owedToUser = await User.findOne({ username: req.body.owedTo });
    const owedBy = owedByUser._id.toString();
    const owedTo = owedToUser._id.toString();
    
    // if (legit) {
      const newFavor = new Favor({
        description: req.body.description,
        owedBy: owedBy,
        owedTo: owedTo
      });
      await newFavor.save();
      res.status(201).json(newFavor);
    // } else {
    //   res.status(401).json({ message: 'Invalid token. Access denied.' });
    // }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all favors associated with 1 user
favorsRouter.get('/:userId', async (req, res) => {
  try {
    const favorsOwedByMe = await Favor.find({ owedBy: req.params.userId }).populate('owedTo', 'username');
    const favorsOwedToMe = await Favor.find({ owedTo: req.params.userId }).populate('owedBy', 'username');
    res.status(200).json({
      owedByMe: favorsOwedByMe,
      owedToMe: favorsOwedToMe
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get one favor
favorsRouter.get('/:id', async (req, res) => {
  try {
    const oneFavor = await Favor.findById(req.params.id);
    res.status(200).json(oneFavor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update one favor
favorsRouter.patch('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedFavor = await Favor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }   // Return the modified document instead of the original.
    );
    console.log(req.file);
    res.status(200).json(updatedFavor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete one favor
favorsRouter.delete('/:id', async (req, res) => {
  try {
    await Favor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Favor successfully deleted.' });
  } catch (err) {
    res.status(500).send(err);
  }
});


export default favorsRouter;
