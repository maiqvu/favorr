import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: {},
      success: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();

    // reset errors and success state for creating a new account
    this.setState({ errors: '' });
    this.setState({ success: false });
    const { username, email, password, passwordConfirmation } = this.state;

    axios
      .post('/api/users/register', {
        username: username,
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
      })
      .then((response) => {
        console.log(response.data);
        this.setState({ username: ''});
        this.setState({ email: ''});
        this.setState({ password: ''});
        this.setState({ passwordConfirmation: ''});
        this.setState({ success: true });
      })
      .catch((err) => {
        this.setState({ errors: err.response.data });
        console.log(this.state.errors);
      });
  }

  render() {
    let { errors, success } = this.state;
    let message;
    if (success)
      message = (
        <div className="text-success text-center">
          Your Account has been created!
        </div>
      );
    else if (Array.isArray(errors.message)) {
      message = errors.message.map((item) => (
        <div className="text-danger text-center" key={item.param}>
          {item.msg}
        </div>
      ));
    } else
      message = <div className="text-danger text-center">{errors.message}</div>;

    return (
      <Container className="mt-4">
        <Row className="justify-content-md-center">
          <Col lg="6" md="8" sm="8">
            <form onSubmit={this.onSubmit}>
              <p className="h4 text-center mb-4">Register</p>
              <div className="form-group">
                <label htmlFor="username" className="grey-text">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
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
                  value={this.state.email}
                  onChange={this.onChange}
                  className="form-control"
                />
              </div>

              <label htmlFor="password" className="grey-text">
                Your password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={this.state.password}
                onChange={this.onChange}
              />
              <br />
              <label htmlFor="passwordConfirmation" className="grey-text">
                Confirm Password
              </label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                className="form-control"
                value={this.state.passwordConfirmation}
                onChange={this.onChange}
              />
              <div className="text-center mt-4">
                <Button color="indigo" type="submit" className="white-text">
                  Register
                </Button>
              </div>
              {message}
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
    );
  }
}

//this.props.history.push('/dashboard')