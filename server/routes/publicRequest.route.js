import express from express;
import PublicRequest from '../models/publicRequest.model';

const requestRouter = express.Router();

// Create a Public request
requestRouter.post('/create-publicRequest', async (req, res) => {
    const { creator, requestDetail, reward } = req.body;
    // Condition to have required field filled out
    if (!creator || !requestDetail || !reward) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }
    
    try {
        const newPublicRequest = new PublicRequest({
            creator,
            requestDetail,
            reward
        });

        await newPublicRequest.save();
        res.send(newPublicRequest);
    } catch (err) {
        res.status(500).send(err);
    }
});

// // Read All Public Requests
// requestRouter.put('/create-publicRequest', async (req, res ) => {
    
// });

// // Get a single Public Request
// requestRouter.post('/create-publicRequest', async (req, res) => {
    
// });

// // Update a Public request


// // Delete a Public Request
// requestRouter.delete('/create-publicRequest', async (req, res) => {
    
// });

export default requestRouter;
