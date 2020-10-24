import React, { createContext, useState, useEffect } from 'react';
import AuthService from './AuthService';

export const AuthContext = createContext();

export default ({children}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    AuthService.isAuthenticated().then(data => {
      if (data.isAuthenticated) {
        setUser(data.user);
        setIsAuthenticated(data.isAuthenticated);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', JSON.stringify(data.isAuthenticated));
      } else {
        localStorage.setItem('user', null);
        localStorage.setItem('isAuthenticated', null);
      }
    });
  }, []);
  
  return (
    <React.Fragment>
      {
        <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
          { children }
        </AuthContext.Provider>
      }
    </React.Fragment>
  );
};
