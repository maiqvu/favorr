import axios from 'axios';

export default {
  getFavors: async (userId) => {
    const res = await axios.get(`/api/favors/${userId}`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
  addFavor: (favor) => {
    return fetch('/api/favors', {
      method: 'post',
      body: JSON.stringify(favor),
      headers: { 'Content-Type' : 'application/json' }
    }).then(res => {
      if (res.status !== 401) {
        return res.json().then(data => data);
      } else {
        return { message: 'Access denied.' }
      }
    })
  },
  updateFavor: (favorId, updatedValue) => {
    return axios.patch(`/api/favors/${favorId}`, updatedValue)
      .then(res => res)
      .catch(err => err)
  },
  findUserByUsername: async (username) => {
    const res = await axios.get(`/api/users?username=${username}`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
};
