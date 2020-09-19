import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

function NavBar (){

    const navStyle = {
        color: 'white'
    };
    
    return(
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
            <Container>
                <Link className="navbar-brand font-weight-bold" to="/">FAVORR</Link>
                <ul className="navbar-nav mr-auto nav-links">
                    <li className="nav-item"><Link style={navStyle} to="/">Public Request</Link></li>
                    <li className="nav-item"><Link style={navStyle}  to="/createPublicRequest">Create Public Request</Link></li>
                </ul>
                <ul className="navbar-nav ml-auto nav-links">
                    <li className="nav-item"><Link style={navStyle} to="/register">Register</Link></li>
                    <li className="nav-item"><Link style={navStyle} to="/login">Login</Link></li>
                </ul>
            </Container>
        </nav>
    );
}

export default NavBar;
