import axios from 'axios';

import { environment as env } from '../../environments/environment';

export default {
  getFavors: async (userId) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.favorsPath}/${userId}`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
  addFavor: (favor) => {
    return fetch(`/${env.favorrApiName}/${env.favorsPath}`, {
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
    return axios.patch(`/${env.favorrApiName}/${env.favorsPath}/${favorId}`, updatedValue)
      .then(res => res)
      .catch(err => err)
  },
  findUserByUsername: async (username) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.usersPath}?username=${username}`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
  findCycle: async (userId) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.favorsPath}/${userId}/cycle`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
};
