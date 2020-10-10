import React, { useState } from 'react';
import AuthService from '../../context/AuthService';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const Register = () => {
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirmation, setPasswordConfirmation ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ successMessage, setSuccessfulMessage ] = useState('');

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };
  
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationInput = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const onSubmit = async (e) => {
      e.preventDefault();
  
      // reset errors and success messages for creating a new account
      setErrorMessage('');
      setSuccessfulMessage('');
  
      // register method returns an error object with a message or null if successful
      const error = await AuthService.register(
        username,
        email,
        password,
        passwordConfirmation
      );

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessfulMessage('Your Account has been created!');
        // reset all fields to empty if register successfully
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
      }
    }

  return (
    <Container className="px-lg-5 mt-4">
      <h4 className="text-center mb-4">Register</h4>
      <Row className="justify-content-md-center">
        <Col lg="6" md="8" sm="8">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="grey-text">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder=""
                name="username"
                value={username}
                onChange={handleUsernameInput}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="grey-text">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailInput}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="grey-text">
                Your password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={password}
                onChange={handlePasswordInput}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="passwordConfirmation" className="grey-text">
                Confirm Password
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                className="form-control"
                value={passwordConfirmation}
                onChange={handlePasswordConfirmationInput}
                required
              />
              {passwordConfirmation && (password !== passwordConfirmation) ? (
                <div className="text-danger text-left">
                  Confirm password does not match!
                </div>
              ) : null}
            </div>
            <div className="text-center mt-4">
              <Button color="indigo" type="submit" className="white-text" disabled={password !== passwordConfirmation}>
                Register
              </Button>
            </div>
            <div>
              <p className="text-success text-center">{successMessage}</p>
              <p className="text-danger text-center">{errorMessage}</p>
            </div>
          </form>
          <p className="font-small grey-text d-flex justify-content-end">
            Already a member?
            <a href="/login" className="blue-text ml-1">
              Sign in
            </a>
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default Register;
