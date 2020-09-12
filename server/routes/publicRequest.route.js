import express from 'express';
import { PublicRequest } from '../models/publicRequest.model';

const requestRouter = express.Router();

// Create a Public request
requestRouter.post('/publicRequest', async (req, res) => {
    const { creator, taker, requestDetail, reward } = req.body;
    // Condition to have required field filled out
    if (!creator || !requestDetail || !reward) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    try {
        const newPublicRequest = new PublicRequest({
            creator: creator,
            taker: taker,
            requestDetail: requestDetail,
            reward: reward
        });

        await newPublicRequest.save();
        res.send(newPublicRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get All Public Requests
requestRouter.get('/publicRequest', async (req, res) => {
    const allRequest = await PublicRequest.find({});

    try {
        res.status(200).send(allRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});

//get one Request
requestRouter.get('/publicRequest/:id', async (req, res) => {
    const oneRequest = await PublicRequest.findById(req.params.id);
    try {
        res.status(200).send(oneRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});


// Update a Public request
requestRouter.patch('/publicRequest/:id', async (req, res) => {
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
requestRouter.delete('/:id', async (req, res) => {
    const content = await PublicRequest.findByIdAndDelete(req.params.id);
    if (!content) res.status(404).send("No Public Request Found")
    res.status(200).send()
});

// Add a reward to an existing request
requestRouter.post('/:id/add-reward', async (req, res) => {
    const requestId = req.params.id;
    const newReward = {
        name: req.body.name,
        item: req.body.item
    };

    try {
        const updatedRequest = await PublicRequest.findOneAndUpdate(
            { _id: requestId },
            { $push: { reward: newReward } },
            { new: true }
        );
        res.send(updatedRequest);
    } catch (err) {
        console.error(err)
    }
})

// Remove a reward in an existing request
requestRouter.patch('/:id/remove-reward', async (req, res) => {
    const requestId = req.params.id;
    const rewardIdToRemove = req.body.rewardId;

    try {
        const updatedRequest = await PublicRequest.findOneAndUpdate(
            { _id: requestId},
            { $pull: { reward: { _id: rewardIdToRemove }}},
            { new: true })
    
        res.send(updatedRequest)
    } catch (err) {
        res.status(500).send(err);
    }
    
})

// Add username to the claimed request
requestRouter.patch('/:id/claim/:username', async (req, res) => {
    const requestId = req.params.id;
    const username = req.params.username;

    try {
        const updatedRequest = await PublicRequest.findOneAndUpdate(
            {_id: requestId},
            {$set: {taker: username}},
            {new: true}
        );
        res.send(updatedRequest)
    } catch (err) {
        res.status(500).send(err);
    }
})

// Get All available Public Requests (requests that have not been claimed)
requestRouter.get('/available', async (req, res) => {
    const allRequest = await PublicRequest.find({
        taker: {$eq: ""}
    });

    res.status(200).send(allRequest);
});

export default requestRouter;
