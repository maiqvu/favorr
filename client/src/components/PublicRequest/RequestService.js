import axios from 'axios';
import { environment as env } from '../../environments/environment';

export default {
    // get requests that have yet to be claimed
    getAvailableRequests: async (limit, skip) => {
        try {
            const response = await axios
                .get(`/${env.favorrApiName}/${env.requestsPath}/available?limit=${limit}&skip=${skip}`);
            return response.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    // get total available request count to determine first and last page
    getAvailableRequestCount: async () => {   
        try {
            const response = await axios
                .get(`/${env.favorrApiName}/${env.requestsPath}/available/count`);
            // return value of count within response object
            return response.data.count;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    // delete a request
    deleteRequest: async (requestId) => {
        try {
            await axios.delete(`/${env.favorrApiName}/${env.requestsPath}/${requestId}`);
            return 0;
        } catch (err) {
            console.error(err);
            return 1
        }
    },
    // claim an available request
    claimRequest: async (requestId, username) => {
        try {
            let response = await axios
                .patch(`/${env.favorrApiName}/${env.requestsPath}/${requestId}/claim/${username}`);
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    // get user's claimed requests
    getClaimedRequests: async (username) => {
        try {
            const response = await axios
                .get(`/${env.favorrApiName}/${env.requestsPath}/claimed/${username}`)
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    // add reward to an available public request
    addReward: async (requestId, username, newReward) => {
        try {
            const response = await axios.post(
                `/${env.favorrApiName}/${env.requestsPath}/${requestId}/reward`,
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
    // remove reward to an available public request
    removeReward: async (requestId, removeRewardId) => {
        try {
            const response = await axios.delete(
                `/${env.favorrApiName}/${env.requestsPath}/${requestId}/reward/${removeRewardId}`
            );
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    // add a new request
    createRequest: async (username, task, reward) => {
        try {
            const response = await axios.post(`/${env.favorrApiName}/${env.requestsPath}`,
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
    },
    // resolve a request with an image to turn it into favors
    resolveRequest: async (requestId, image) => {
        if (image.type.includes('image')) {
            try {
                // Construct form fields to hold image data
                const data = new FormData();
                data.append('file', image, image.name);
                const response = await axios.patch(`/${env.favorrApiName}/${env.requestsPath}/${requestId}/resolve`, data);
                return response.data;
            } catch (err) {
                console.log(err);
                return null;
            }
        }
    }
}