import React from 'react';
import {Redirect} from 'react-router-dom';

const ProtectedRoute = (props) => {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
    const Component = props.component;
    
    return isAuthenticated ? (
        <Component />
    ) : (
        <Redirect to ={{pathname: '/login'}} />
    );

}

export default ProtectedRoute;