// Import packages
import express from 'express';
import formidable from 'express-formidable';

// Import mongoose model
import PublicRequest from '../models/publicRequest.model';
import User from '../models/user.model';

const publicRequestsRouter = express.Router();

// Create a Public request
publicRequestsRouter.post('/', async (req, res) => {
    const { creator, claimedBy, claimedByTime, task, reward } = req.body;
    // Condition to have required field filled out
    if (!creator || !task || !reward.user || !reward.item) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    try {
        const creatorUser = await User.findOne({ username: req.body.creator });
        const rewardUser = await User.findOne({ username: req.body.reward.user });

        const creatorUserId = creatorUser._id.toString();
        reward.user = rewardUser._id.toString();

        const newPublicRequest = new PublicRequest({
            creator: creatorUserId,
            claimedBy: claimedBy,
            claimedByTime: claimedByTime,
            task: task,
            rewards: [reward]
        });

        await newPublicRequest.save();
        res.send(newPublicRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get All Public Requests
publicRequestsRouter.get('/publicRequest', async (req, res) => {
    const allRequest = await PublicRequest.find({});

    try {
        res.status(200).send(allRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});

//get one Request
publicRequestsRouter.get('/publicRequest/:id', async (req, res) => {
    const oneRequest = await PublicRequest.findById(req.params.id);
    try {
        res.status(200).send(oneRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});


// Update a Public request
publicRequestsRouter.patch('/publicRequest/:id', async (req, res) => {
    try {
        await PublicRequest.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { omitUndefined: true } //delete any properties whose value is undefined when casting an update
        );
        await PublicRequest.save();
        res.status(200).send("Update sucess!");
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a Public Request
publicRequestsRouter.delete('/:id', async (req, res) => {
    const content = await PublicRequest.findByIdAndDelete(req.params.id);
    if (!content) res.status(404).send("No Public Request Found")
    res.status(200).send()
});

// Add a reward to an existing request
publicRequestsRouter.post('/:id/add-reward', async (req, res) => {
    const requestId = req.params.id;

    const user = await User.findOne({ username: req.body.username });
    const userId = user._id.toString();

    const newReward = {
        user: userId,
        item: req.body.item
    };

    try {
        const updatedRequest = await PublicRequest.findOneAndUpdate(
            { _id: requestId },
            { $push: { rewards: newReward } },
            { new: true }).populate('creator').populate('rewards.user');
        res.send(updatedRequest);
    } catch (err) {
        console.error(err)
    }
})

// Remove a reward in an existing request
publicRequestsRouter.patch('/:id/remove-reward', async (req, res) => {
    const requestId = req.params.id;
    const rewardIdToRemove = req.body.rewardId;

    try {
        const updatedRequest = await PublicRequest.findOneAndUpdate(
            { _id: requestId},
            { $pull: { rewards: { _id: rewardIdToRemove }}},
            { new: true }).populate('creator').populate('rewards.user')    
        res.status(200).send(updatedRequest)
    } catch (err) {
        res.status(500).send(err);
    }
    
})

// Add username to the claimed request
publicRequestsRouter.patch('/:id/claim/:username', async (req, res) => {
    const requestId = req.params.id;
    const user = await User.findOne({ username: req.params.username });
    const userId = user._id.toString();

    const updatedRequest = await PublicRequest.findOneAndUpdate(
        {_id: requestId},
        {$set: {claimedBy: userId, claimedByTime: Date.now()}},
        {new: true}
    ).populate('creator').populate('rewards.user');
    res.send(updatedRequest)
})

// Get All available Public Requests (requests that have not been claimed)
publicRequestsRouter.get('/available', async (req, res) => {
    const allAvailableRequests = await PublicRequest.find({
        claimedBy: {$eq: null}
    }).populate('creator').populate('rewards.user').sort({ createdAt: -1 });

    res.status(200).send(allAvailableRequests);
});

// Get all the user's claimed public requests
publicRequestsRouter.get('/claimed/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    const userId = user._id.toString();

    const userClaimedRequests = await PublicRequest.find({
        claimedBy: {$eq: userId}
    }).populate('creator').populate('rewards.user');

    res.status(200).send(userClaimedRequests);
})

// Upload an image as proof when resolving a public request
publicRequestsRouter.post('/:id/uploadimage', formidable(), async (req, res) => {
    const requestId = req.params.id;
    const fileType = req.files.myFile.type;

    if (!fileType.includes('image')) {
        res.send(400).json({ message: 'Invalid file type. Please upload an image.'})
    }

    // add file name to request and return updated request
})

export default publicRequestsRouter;
