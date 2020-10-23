import express from 'express';
import Favor from '../models/favor.model';

const leaderboardRouter = express.Router();

const limit = 5;

// Pipeline to retrieve data and calculate top users with most owed-to-me favors
const pipepline = [
    {
        '$lookup': {
            'from': 'users',
            'localField': 'owedTo',
            'foreignField': '_id',
            'as': 'owedTo'
        }
    }, {
        '$unwind': {
            'path': '$owedTo'
        }
    }, {
        '$group': {
            '_id': '$owedTo.username',
            'haveMostFavor': {
                '$sum': 1
            }
        }
    }, {
        '$sort': {
            'haveMostFavor': -1
        }
    }, {
        '$limit': limit
    }
];

// Get list of top 5 people with most unrepaid favors
// Read from favors collection
leaderboardRouter.get('/', async (req, res) => {
    const topTenFavor = await Favor.aggregate(pipepline);

    try {
        res.status(200).send(topTenFavor);
    } catch (err) {
        res.status(500).send(err);
    }
});



export default leaderboardRouter;