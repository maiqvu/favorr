import 'dotenv/config';
import express from 'express';
// import jwt from 'jsonwebtoken';
import Favor from '../models/favor.model';
import User from '../models/user.model';
import { upload } from '../utils/multer';

const favorsRouter = express.Router();


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

let cycleList;
let hasCycle;

// Get all favors associated with 1 user
favorsRouter.get('/:userId', async (req, res) => {
  try {
    const favorsOwedByMe = await Favor.find({ owedBy: req.params.userId }).populate('owedTo', 'username');
    const favorsOwedToMe = await Favor.find({ owedTo: req.params.userId }).populate('owedBy', 'username');

    res.status(200).json({
      owedByMe: favorsOwedByMe,
      owedToMe: favorsOwedToMe,
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

// Get cyle
favorsRouter.get('/:userId/cycle', async (req, res) => {
  try {
    await findCycle(req.params.userId);

    res.status(200).json({
      cycleList: cycleList
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

const findCycle = async (userId) =>{
  cycleList = [];
    hasCycle = false;
    const root = await Favor.findOne({ owedBy: userId, repaid: false }).populate('owedBy', 'username');
    if (root != null){
      await DFS(root.owedBy);
      console.log(cycleList);
    }
}

const DFS = async (User) => {

  let notFoundUser = true;
  for(let i = 0; i < cycleList.length; i++){
    //console.log(cycleList);
    if (cycleList[i]._id.toString() == User._id.toString()){
      notFoundUser = false;
      if (i == 0){
        hasCycle = true;
      }
      break;
    }
  }

  if (notFoundUser){
    cycleList.push(User);
    //console.log(cycleList);
    try {
      const nextUser = await Favor.find({ owedBy: User._id, repaid: false }).populate('owedTo', 'username');
      console.log(nextUser);

      nextUser.forEach(function(item, index) {
        //console.log("ID: ", item.owedTo);
        DFS(item.owedTo)
        if (hasCycle)
          return;
      });
    } catch (err){
      console.log(err);
    }
  }
}

// Get one favor
favorsRouter.get('/:id', async (req, res) => {
  try {
    const oneFavor = await Favor.findById(req.params.id);
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
  try {
    await Favor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Favor successfully deleted.' });
  } catch (err) {
    res.status(500).send(err);
  }
});


export default favorsRouter;
