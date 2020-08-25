import express from 'express';
import { PublicRequest } from '../models/publicRequest.model';

const requestRouter = express.Router();

// Create a Public request
requestRouter.post('/create-publicRequest', async (req, res) => {
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

// Read All Public Requests
requestRouter.get('/public', async (req, res) => {
    const allContent = await PublicRequest.find({});

    try {
        res.send(allContent);
    } catch (err) {
        res.status(500).send(err);
    }
});


// Update a Public request
requestRouter.patch('/update-publicRequest', async (req, res) => {
    try {
        await PublicRequest.findByIdAndUpdate(req.params.id, req.body);
        await PublicRequest.save();
        res.status(200).send("Update sucess!");
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a Public Request
requestRouter.delete('/delete-publicRequest', async (req, res) => {
    try {
        const content = await PublicRequest.findByIdAndDelete(req.params.id);
        if (!content) res.status(404).send("No Public Request Found")
        res.status(200).send()
    } catch 
});

export default requestRouter;
