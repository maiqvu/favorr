import axios from 'axios';
import { environment as env } from '../../environments/environment';

export default {
  getOwedByMeFavors: async (userId, limit, skip) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.favorsPath}/${userId}/owedByMe?limit=${limit}&skip=${skip}`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
  getOwedToMeFavors: async (userId, limit, skip) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.favorsPath}/${userId}/owedToMe?limit=${limit}&skip=${skip}`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
  getOwedByMeFavorsCount: async (userId) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.favorsPath}/${userId}/owedByMe/count`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
  getOwedToMeFavorsCount: async (userId) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.favorsPath}/${userId}/owedToMe/count`);
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
          if (res.status === 201) 
          //return res.data
          return 0
          else return { message: 'Failed to add new favor.' }
        });
    } else {   // Add favor owed to the logged in user
      try {
        // create favor only if the file type is an image
        if (image.type.includes('image')) {
          // Create favor
          const res = await axios.post(`/${env.favorrApiName}/${env.favorsPath}`, favor);
          const newFavorId = res.data._id;
          // Upload image when creating a favor
          const uploadRes = await uploadImage(image, newFavorId, 'submit');
          console.log(uploadRes);
          //return 0 for add favor conditional
          return 0;
        } else {
          return { message: 'Invalid file type.'}
        }
      } catch (err) {
        console.error(err);
        return { message: 'Unable to add new favor. Please try again later.'}
      }

      // const imgConfig = await axios.get(`/${env.favorrApiName}/upload`);
      // console.log(imgConfig);
      
      // await axios
      //   .put(`${imgConfig.data.url}`, image, {headers: {'Content-Type': image.type}})
      //   .then(res => console.log(res))
      
      // const payload = { ...favor, image: imgConfig.data.key }
      // return axios
      //   .post(`${env.favorrApiName}/${env.favorsPath}`, payload)
      //   .then(res => console.log(res))
    }
  },
  updateOwedByFavor: (favorId, updatePayload) => {
    return axios.patch(`/${env.favorrApiName}/${env.favorsPath}/f/owedByMe/${favorId}`, updatePayload)
      .then(res => res)
      .catch(err => err)
  },
  updateOwedToFavor: (favorId, updatePayload) => {
    return axios.patch(`/${env.favorrApiName}/${env.favorsPath}/f/owedToMe/${favorId}`, updatePayload)
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
  findCycle: async (userId) => {
    const res = await axios.get(`/${env.favorrApiName}/${env.favorsPath}/${userId}/cycle`);
    if (res.status !== 401) {
      return res.data;
    } else {
      return { message: 'Access denied.' }
    }
  },
  markRepaidWithImage: async (image, favorId) => {
    const res = await uploadImage(image, favorId, 'repaid');
    return res
  }
};

const uploadImage = async (image, newFavorId, type) => {
  // Construct form fields to hold image data
  const data = new FormData();
  data.append('file', image, image.name);
  // Upload image
  const uploadRes = await axios.post(`/${env.favorrApiName}/${env.uploadPath}/${newFavorId}/${type}`, data);
  return uploadRes;
}
