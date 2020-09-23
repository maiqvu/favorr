export default {
  login: (user) => {
    return fetch('/api/users/login', {
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
  isAuthenticated: () => {
    return fetch('/api/users/isAuthenticated').then(res => {
      if (res.status !== 401) {
        return res.json().then(data => data);
      } else {
        return { isAuthenticated: false, user: {username: '', _id: ''} };
      }
    });
  }
};