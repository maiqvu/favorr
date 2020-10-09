// Import mongoose model
import PublicRequest from '../models/publicRequest.model';
import User from '../models/user.model';

export default {
    createRequest: async (creator, claimedBy, claimedByTime, task, reward) => {
        // Lookup user in users collection
        const creatorUser = await User.findOne({ username: creator });
        const rewardUser = await User.findOne({ username: reward.user });
        // Convert object ids to string for storing in requests collection
        const creatorUserId = creatorUser._id.toString();
        reward.user = rewardUser._id.toString();
        // construct new request document
        const newPublicRequest = new PublicRequest({
            creator: creatorUserId,
            claimedBy: claimedBy,
            claimedByTime: claimedByTime,
            task: task,
            rewards: [reward]
        });
        // Save to request database
        await newPublicRequest.save();
        // return created request
        return newPublicRequest
    },
    addReward: async (requestId, username, item) => {
        // get user id by username from users collection
        const user = await User.findOne({ username: username });
        const userId = user._id.toString();
        // construct reward object
        const newReward = {
            user: userId,
            item: item
        };
        // update existing request
        const updatedRequest = await PublicRequest.findOneAndUpdate(
            { _id: requestId },
            { $push: { rewards: newReward } },
            { new: true })
            .populate('creator')
            .populate('rewards.user');
        return updatedRequest;
    },
    deleteReward: async (requestId, rewardId) => {
        const updatedRequest = await PublicRequest.findOneAndUpdate(
            { _id: requestId},
            { $pull: { rewards: { _id: rewardId }}},
            { new: true })
            .populate('creator', 'username')
            .populate('rewards.user', 'username');
        return updatedRequest;
    },
    getAvailableRequests: async (limit, skip) => {
        const availableRequests = await PublicRequest.find({
            claimedBy: {$eq: null}
        })
        .sort({ createdAt: -1 })
        .skip(skip) // Always apply 'skip' before 'limit'
        .limit(limit) // This is the 'page size'
        .populate('creator', 'username')
        .populate('rewards.user', 'username');
        return availableRequests;
    }
}