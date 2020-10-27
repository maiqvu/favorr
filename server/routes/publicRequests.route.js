// Import packages
import express from 'express';
// Import service modules
import RequestsService from '../services/requests.service';
import FavorsService from '../services/favors.service';
import UploadService from '../services/upload.service';
// Create publicRequestsRouter
const publicRequestsRouter = express.Router();

// Create a Public request
publicRequestsRouter.post('/', async (req, res) => {
    const { creator, claimedBy, claimedByTime, task, reward } = req.body;
    // Condition to have required field filled out
    if (!creator || !task || !reward.user || !reward.item) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }
    try {
        const newPublicRequest = await RequestsService.createRequest(
            creator,
            claimedBy,
            claimedByTime,
            task,
            reward
        );
        res.status(200).send(newPublicRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a Public Request
publicRequestsRouter.delete('/:id', async (req, res) => {
    const requestId = req.params.id;
    const content = await RequestsService.deleteRequest(requestId);
    if (content) {
        res.status(200).send()
    } else {
        res.status(404).send("No Public Request Found")
    }
});

// Add a reward to an existing request
publicRequestsRouter.post('/:id/reward', async (req, res) => {
    const requestId = req.params.id;
    const { username, item } = req.body;
    try {
        const updatedRequest = await RequestsService.addReward(
            requestId,
            username,
            item
        );
        res.status(200).send(updatedRequest);
    } catch (err) {
        res.status(500).send(err);
    }
})

// Remove a reward in an existing request
publicRequestsRouter.delete('/:id/reward/:rewardid', async (req, res) => {
    const requestId = req.params.id;
    const rewardId = req.params.rewardid;
    try {
        const updatedRequest = await RequestsService.deleteReward(
            requestId,
            rewardId
        )
        res.status(200).send(updatedRequest)
    } catch (err) {
        res.status(500).send(err);
    }
})

// Claim a request
publicRequestsRouter.patch('/:id/claim/:username', async (req, res) => {
    const requestId = req.params.id;
    const username = req.params.username;
    try {
        const updatedRequest = await RequestsService.claimRequest(
            requestId,
            username
        );
        res.status(200).send(updatedRequest);
    } catch (err) {
        res.status(500).send(err);
    }
})

// Get available Public Requests (requests that have not been claimed)
publicRequestsRouter.get('/available', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    try {
        const availableRequests = await RequestsService.getAvailableRequests(
            limit,
            skip
        );
        res.status(200).send(availableRequests);
    } catch (err) {
        res.status(500).send(err)
    }
});

// Get count of available Public Requests (requests that have not been claimed)
publicRequestsRouter.get('/available/count', async (req, res) => {
    try {
        const availableRequestCount = await RequestsService.getAvailableRequestCount();
        res.status(200).json({count: availableRequestCount})
    } catch(err){
        res.status(500).json(err)
    }
});

// Get all the user's claimed public requests
publicRequestsRouter.get('/claimed/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const userClaimedRequests = await RequestsService.getUserClaimedRequests(username);
        res.status(200).send(userClaimedRequests);
    } catch (err) {
        res.status(500).send(err);
    }    
})

// Resolve a request by creating favors
publicRequestsRouter.patch('/:requestid/resolve', UploadService.upload.single('file'), async (req, res) => {
    const requestId = req.params.requestid;
    const file = req.file;
    try {
        // update request to resolved
        const resolvedRequest = await RequestsService.resolveRequest(requestId);
        let owedTo = resolvedRequest.claimedBy.username
        for (let reward of resolvedRequest.rewards) {
            let description = reward.item;
            let owedBy = reward.user.username;
            // check if owedBy is same as owedTo, if true then favor is not created.
            if (owedBy === owedTo) {
                continue;
            }
            // create a favor according to the request details
            const favor = await FavorsService.createFavor(
                description,
                owedBy,
                owedTo
            );
            let favorId = favor._id;
            // upload picture proof
            const stored = await UploadService.s3Upload(
                file,
                favorId,
                'submit'
            );
        }
        res.status(200).send(resolvedRequest);
    } catch (err) {
        res.status(500).send(err);
    }
})

export default publicRequestsRouter;
