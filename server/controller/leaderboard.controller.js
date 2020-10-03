// Import packages
import express from 'express';
// Import mongoose model
import PublicRequest from '../models/publicRequest.model';
import User from '../models/user.model';
import Favor from '../models/favor.model';
import Leaderboard from '../models/leaderboard.model';
import mongoose from 'mongoose';


const limit = 5;

//aggregate ownedTo descending order, limit to top 10 people

exports.index = async function () {
    const result = await Favor.aggregate([
    {
        '$match': { 'repaid': false }
    }, {
        '$group': {
            '_id': { 'name': '$owedTo' },
            'haveMostFavor': { '$sum': 1 }
        }
    }, {
        '$sort': { 'haveMostFavor': -1 }
    }, , {
        '$limit': limit
    }
]);

try {
    const firstLeaderboard = new Leaderboard({
        user: result._id,
        item: result.haveMostFavor
    })
    await firstLeaderboard.save();
} catch (err) {
    res.status(500).send(err);
}

};
