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
  addFavor: async (favor, image) => {
    if (image === '') {   // Add favor owed by the logged in user
      return axios
        .post(`/${env.favorrApiName}/${env.favorsPath}`, favor)
        .then(res => {
          if (res.status === 201) return res.data
          else return { message: 'Failed to add new favor.' }
        });
    } else {   // Add favor owed to the logged in user
      const imgConfig = await axios.get(`/${env.favorrApiName}/upload`);
      console.log(imgConfig);
      
      await axios
        .put(`${imgConfig.data.url}`, image, {headers: {'Content-Type': image.type}})
        .then(res => console.log(res))
      
      const payload = { ...favor, image: imgConfig.data.key }
      return axios
        .post(`${env.favorrApiName}/${env.favorsPath}`, payload)
        .then(res => console.log(res))
    }
  },
  updateFavor: (favorId, updatedValue) => {
    return axios.patch(`/${env.favorrApiName}/${env.favorsPath}/${favorId}`, updatedValue)
      .then(res => res)
      .catch(err => err)
  },
  findUserByUsername: async (username) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.usersPath}?username=${username}`);
    if (res.status === 200) {
      return res.data;
    } else if (res.status === 401) {
      return { message: 'Access denied.' }
    }
  },
};
