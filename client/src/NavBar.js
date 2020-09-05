import React from 'react';
import { Link } from 'react-router-dom';

function NavBar (){

    const navStyle = {
        color: 'white'
    };
    
    return(
        <nav>
            <h3>Logo</h3>
            <ul className="nav-links">
                <li><Link style={navStyle} to="/">Public Request</Link></li>
                <li><Link style={navStyle}  to="/createPublicRequest">Create Public Request</Link></li>
                <li><Link style={navStyle} to="/login">Login</Link></li>
                <li><Link style={navStyle} to="/register">Register</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;
