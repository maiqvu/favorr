import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { Container, Row, Col, Button } from 'react-bootstrap';
=======
import { AuthContext } from './context/AuthContext';
import Button from 'react-bootstrap/Button';
>>>>>>> 8253ab27dde852943b47c6f8f07af6a20aa40623

const NavBar = (props) => {
  const { user, isAuthenticated } = useContext(AuthContext);

<<<<<<< HEAD
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
=======
  const unauthenticatedNavBar = () => {
    return (
      <React.Fragment>
        <Link className="nav-item nav-link" to="/">
          Public Request
        </Link>
        <Link className="nav-item nav-link" to="/login">
          Login
        </Link>
        <Link className="nav-item nav-link" to="/register">
          Register
        </Link>
      </React.Fragment>
>>>>>>> 8253ab27dde852943b47c6f8f07af6a20aa40623
    );
  };

  const authenticatedNavBar = () => {
    return (
      <React.Fragment>
        <div>Welcome {user.username}!</div>
        <Link className="nav-item nav-link" to="/">
          Public Request
        </Link>
        <Link className="nav-item nav-link" to="/createPublicRequest">
          Create Public Request
        </Link>
        <Link className="nav-item nav-link" to="/myclaimedRequests">
          My Claimed Requests
        </Link>
        <Link className="nav-item nav-link" to="/myFavors">
          My Favors
        </Link>
        <Link className="nav-item nav-link" to="/addFavor">
          Create Favor
        </Link>
      </React.Fragment>
    );
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">Favorr</Link>
      
      <Button
        className="navbar-toggler"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </Button>
      
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          { !isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar() }
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
