// Import packages
import express from 'express';
// Import mongoose model
import PublicRequest from '../models/publicRequest.model';
import User from '../models/user.model';
import Favor from '../models/favor.model';
import FavorService from '../../client/src/components/Favor/FavorService';
import mongoose from 'mongoose';


const limit = 5;

//aggregate ownedTo descending order, limit to top 10 people

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