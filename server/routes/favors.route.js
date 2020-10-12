import 'dotenv/config';
import express from 'express';
// import jwt from 'jsonwebtoken';
import Favor from '../models/favor.model';
import Proof from '../models/proof.model';
import { upload } from '../utils/multer';
import FavorsService from '../services/favors.service';

const favorsRouter = express.Router();

// Create a new favor
favorsRouter.post('/', async (req, res) => {
  // const token = req.headers.token;
  const description = req.body.description;
  const owedBy = req.body.owedBy;
  const owedTo = req.body.owedTo;
  // Check if all required fields are provided
  if (!description || !owedBy || !owedTo) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  } else if (owedBy === owedTo) {
    return res.status(400).json({ message: 'Invalid fields. The favor is owed by the same person.' });
  }

  try {
    const newFavor = await FavorsService.createFavor(
      description,
      owedBy,
      owedTo
    )
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
  const userId = req.params.userId;
  
  try {
    const favorsOwedByMe = await Favor.find({ owedBy: userId }).populate('owedTo', 'username');
    const favorsOwedToMe = await Favor.find({ owedTo: userId }).populate('owedBy', 'username');
    
    for (const favor of favorsOwedByMe) {
      const each = await Proof.find({ favorId: favor._id });
      if (each.length > 0) favor.image = each[0].fileLink;
    };
    
    for (const favor of favorsOwedToMe) {
      const each = await Proof.find({ favorId: favor._id });
      if (each.length > 0) favor.image = each[0].fileLink;
    };
    
    res.status(200).json({
      owedByMe: favorsOwedByMe,
      owedToMe: favorsOwedToMe,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get cycle
favorsRouter.get('/:userId/cycle', async (req, res) => {
  const userId = req.params.userId;
  try {
    const cycleList = await FavorsService.findCycle(userId);
    res.status(200).json({
      cycleList: cycleList
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get one favor
favorsRouter.get('/f/:id', async (req, res) => {
  const favorId = req.params.id;
  try {
    const oneFavor = await FavorsService.getFavor(favorId);
    res.status(200).json(oneFavor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update one favor with new repaid status and proof image
favorsRouter.patch('/:id', upload, async (req, res) => {
  try {
    const repaid = req.body.repaid;
    const image = req.file.path;
    
    const updatedFavor = await Favor.findByIdAndUpdate(
      req.params.id,
      { repaid, image },
      { new: true }   // Return the modified document instead of the original.
    );
    res.status(200).json(updatedFavor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete one favor
favorsRouter.delete('/:id', async (req, res) => {
  const favorId = req.params.id;
  try {
    await FavorsService.deleteFavor(favorId);
    res.status(200).json({ message: 'Favor successfully deleted.' });
  } catch (err) {
    res.status(500).send(err);
  }
});

export default favorsRouter;
