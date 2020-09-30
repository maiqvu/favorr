import axios from 'axios';

export default {
    // get requests that have yet to be claimed
    getAvailableRequests: async (limit, skip) => {
        try {
            const response = await axios.get(`/api/publicRequests/available?limit=${limit}&skip=${skip}`);
            return response.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    // get total available request count to determine first and last page
    getAvailableRequestCount: async () => {   
        try {
            const response = await axios.get(`/api/publicRequests/available/count`);
            // return value of count within response object
            return response.data.count;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    deleteRequest: async (requestId) => {
        try {
            await axios.delete(`/api/publicRequests/${requestId}`);
            return 0;
        } catch (err) {
            console.error(err);
            return 1
        }
    },
    claimRequest: async (requestId, username) => {
        try {
            let response = await axios.patch(`/api/publicRequests/${requestId}/claim/${username}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    getClaimedRequests: async (username) => {
        try {
            const response = await axios.get(`/api/publicRequests/claimed/${username}`)
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    addReward: async (requestId, username, newReward) => {
        try {
            const response = await axios.post(
                `/api/publicRequests/${requestId}/reward`,
                {
                    username: username,
                    item: newReward,
                }
            );
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    removeReward: async (requestId, removeRewardId) => {
        try {
            const response = await axios.delete(
                `/api/publicRequests/${requestId}/reward/${removeRewardId}`
            );
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    createRequest: async (username, task, reward) => {
        try {
            const response = await axios.post(`/api/publicRequests`,
                {
                    creator: username,
                    claimedBy: null,
                    claimedByTime: null,
                    task: task,
                    reward: { 
                        user: username,
                        item: reward
                    }
                });
            return response.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}