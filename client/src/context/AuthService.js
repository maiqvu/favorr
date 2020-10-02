import axios from 'axios';
import { environment as env } from '../environments/environment';

export default {
  login: (user) => {
    return fetch(`/${env.favorrApiName}/${env.usersPath}/login`, {
      method: 'post',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 401) {
        return res.json().then(data => data);
      } else {
        return { isAuthenticated: false, user: {username: '', _id: ''} };
      }
    });
  },
  logout: () =>{
    return fetch(`/${env.favorrApiName}/${env.usersPath}/logout`)
      .then(res => {
        if (res.status !== 401) {
          return res.json().then(data => data);
        }
      });
  },
  isAuthenticated: () => {
    return fetch(`/${env.favorrApiName}/${env.usersPath}/isAuthenticated`, {
      method: 'get',
    }).then(res => {
      if (res.status !== 401) {
        return res.json().then(data => data);
      } else {
        return { isAuthenticated: false, user: {username: '', _id: ''} };
      }
    });
  },
  register: async (username, email, password, passwordConfirmation) => {
    try {
      const response = await axios.post(`/${env.favorrApiName}/${env.usersPath}/register`, {
          username: username,
          email: email,
          password: password,
          passwordConfirmation: passwordConfirmation,
        });
      console.log(response.data)
      return null;
    } catch (err) {
      console.error(err);
      return err.response.data;
    }
  }
};