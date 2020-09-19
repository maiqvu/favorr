import React, { createContext, useState, useEffect } from 'react';
import AuthService from './AuthService';

export const AuthContext = createContext();

export default ({children}) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    AuthService.isAuthenticated().then(data => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsLoaded(true);
    });
  }, []);
  
  return (
    <React.Fragment>
      {/* If isLoaded is false, render a 'Loading...' message. Otherwise, render the global context provider wrapping around children components. */}
      {
        !isLoaded 
        ? 
        <div>Loading...</div>
        : 
        <AuthContext.Provider value={{user, setUser, isAuthenticated, setIsAuthenticated}}>
          { children }
        </AuthContext.Provider>
      }
    </React.Fragment>
  );
};
