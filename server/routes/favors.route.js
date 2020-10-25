import 'dotenv/config';
import express from 'express';
import FavorsService from '../services/favors.service';

const favorsRouter = express.Router();

// Create a new favor
favorsRouter.post('/', async (req, res) => {
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
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all favors owed by 1 user
favorsRouter.get('/:userId/owedByMe', async (req, res) => {
  const userId = req.params.userId;
  
  // pagination parameters
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  
  try {
    const favorsOwedByMe = await FavorsService.getOwedByUserFavors(userId, limit, skip);
    
    res.status(200).json(favorsOwedByMe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all favors owed to 1 user
favorsRouter.get('/:userId/owedToMe', async (req, res) => {
  const userId = req.params.userId;
  
  // pagination parameters
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  
  try {
    const favorsOwedToMe = await FavorsService.getOwedToUserFavors(userId, limit, skip);
    res.status(200).json(favorsOwedToMe);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get favors count owed by user
favorsRouter.get('/:userId/owedByMe/count', async (req, res) => {
  const userId = req.params.userId;
  try {
    const favorsOwedByMeCount = await FavorsService.getOwedByUserFavorsCount(userId);

    res.status(200).json(favorsOwedByMeCount)
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get favors count owed to user
favorsRouter.get('/:userId/owedToMe/count', async (req, res) => {
  const userId = req.params.userId;
  try {
    const favorsOwedToMeCount = await FavorsService.getOwedToUserFavorsCount(userId);

    res.status(200).json(favorsOwedToMeCount)
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get cycle
favorsRouter.get('/:userId/cycle', async (req, res) => {
  const userId = req.params.userId;
  try {
    const cycleList = await FavorsService.findCycle(userId);
    const rewardList = await FavorsService.findRewardCycle();

    res.status(200).json({
      cycleList: cycleList,
      rewardList: rewardList
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

// Update a favor with new repaid status
favorsRouter.patch('/f/:favorId', async (req, res) => {
  if (!req.body.repaid) {
    return res.status(400).json({ message: 'Invalid PATCH request.' });
  }
  
  try {
    const repaid = req.body.repaid;
    const favorId = req.params.favorId;
    
    const updatedFavor = await FavorsService.markAsRepaid(favorId, repaid);
    res.status(200).json(updatedFavor);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete one favor
favorsRouter.delete('/f/:id', async (req, res) => {
  const favorId = req.params.id;
  try {
    await FavorsService.deleteFavor(favorId);
    res.status(200).json({ message: 'Favor successfully deleted.' });
  } catch (err) {
    res.status(500).send(err);
  }
});

export default favorsRouter;
