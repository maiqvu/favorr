import React, { createContext, useState, useEffect } from 'react';
import AuthService from './AuthService';

export const AuthContext = createContext();

export default ({children}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogged, setLogged] = useState(false);
  
  useEffect(() => {
    AuthService.isAuthenticated().then(data => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
    });
  }, []);
  
  return (
    <React.Fragment>
      {
        <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated, isLogged, setLogged}}>
          { children }
        </AuthContext.Provider>
      }
    </React.Fragment>
  );
};
