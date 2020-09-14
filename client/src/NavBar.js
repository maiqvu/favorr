import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {    
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Favorr</Link>
            <div class="collapse navbar-collapse">
                <div class="navbar-nav">
                    <Link className="nav-item nav-link" to="/">Public Request</Link>
                    <Link className="nav-item nav-link" to="/createPublicRequest">Create Public Request</Link>
                    <Link className="nav-item nav-link" to="/login">Login</Link>
                    <Link className="nav-item nav-link" to="/register">Register</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
