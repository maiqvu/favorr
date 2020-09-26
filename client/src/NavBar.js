import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthContext } from './context/AuthContext';
import AuthService from './context/AuthService';
import Button from 'react-bootstrap/Button';
import Cookie from 'universal-cookie';

const NavBar = (props) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  const unauthenticatedNavBar = () => {
    return (
      <React.Fragment>
        <ul className="navbar-nav mr-auto nav-links">
            <li className="nav-item"><Link to="/">Public Request</Link></li>
        </ul>
        <ul className="navbar-nav ml-auto nav-links">
            <li className="nav-item"><Link to="/register">Register</Link></li>
            <li className="nav-item"><Link to="/login">Login</Link></li>
        </ul>
      </React.Fragment>
    );
  };

  const logoutHandler = () => {
    AuthService.logout();
    window.location.reload(false);
  }

  const authenticatedNavBar = () => {
    return (
      <React.Fragment >
        <ul className="navbar-nav mr-auto nav-links">
            <li className="nav-item">
                <Link className="nav-link" to="/">Public Request</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/createPublicRequest">Create Public Request</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/myclaimedRequests">
                    My Claimed Requests
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/myFavors">
                    My Favors
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/addFavor">
                    Create Favor
                </Link>
            </li>
        </ul>
        <ul className="navbar-nav ml-auto nav-links">
          <li className="nav-item text-light">Welcome {user.username}!</li>
            <li className="nav-item"><Link to="/" onClick={logoutHandler} >Logout</Link></li>
        </ul>
      </React.Fragment>
    );
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <Container>  
        <Link className="navbar-brand font-weight-bold" to="/">FAVORR</Link>
        
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
        
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            { !isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar() }
        </div>
      </Container>
    </nav>
  );
};

export default NavBar;
