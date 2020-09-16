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
  createFavor: (favor) => {
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
  }
};
