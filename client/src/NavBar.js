import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

function NavBar() {    
    return(
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Favorr</Link>
            <Button className="navbar-toggler" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </Button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <Link className="nav-item nav-link" to="/">Public Request</Link>
                    <Link className="nav-item nav-link" to="/createPublicRequest">Create Public Request</Link>
                    <Link className="nav-item nav-link" to="/myclaimedRequests">My Claimed Requests</Link>
                    <Link className="nav-item nav-link" to="/myFavors">My Favors</Link>
                    <Link className="nav-item nav-link" to="/login">Login</Link>
                    <Link className="nav-item nav-link" to="/register">Register</Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
