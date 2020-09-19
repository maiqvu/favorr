import 'dotenv/config';
import express from 'express';
import Favor from '../models/favor.model';

const favorsRouter = express.Router();


// Create a new favor
favorsRouter.post('/:userId', async (req, res) => {
  const { description, owedBy, owedTo } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'Please enter all required fields.' });
  }

  try {
    const newFavor = new Favor({
      description: description,
      owedBy: req.params.userId,
      owedTo: owedTo
    });

    await newFavor.save();
    res.status(201).json(newFavor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all favors associated with 1 user
favorsRouter.get('/:userId', async (req, res) => {
  try {
    const favorsOwedByMe = await Favor.find({ owedBy: req.params.userId }).populate('owedBy').populate('owedTo');
    const favorsOwedToMe = await Favor.find({ owedTo: req.params.userId }).populate('owedBy').populate('owedTo');
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
favorsRouter.patch('/:id', async (req, res) => {
  try {
    const updatedFavor = await Favor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }   // Return the modified document instead of the original.
    );
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
