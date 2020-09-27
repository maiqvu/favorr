import React, {useContext} from 'react';
import {Redirect} from 'react-router-dom';

const PublicRoute = (props) => {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated'));
    const Component = props.component;

    console.log(props.path);
    
    return !isAuthenticated ? (
        <Component />
    ) : (
        <Redirect to ={{pathname: '/'}} />
    );

}

export default PublicRoute;