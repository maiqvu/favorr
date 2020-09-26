import React, {useContext} from 'react';
import {Redirect} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';

const ProtectedRoute = (props) => {
    const {isAuthenticated } = useContext(AuthContext);
    const Component = props.component;

    console.log(props.path);
    
    return isAuthenticated ? (
        <Component />
    ) : (
        <Redirect to ={{pathname: '/login'}} />
    );

}

export default ProtectedRoute;