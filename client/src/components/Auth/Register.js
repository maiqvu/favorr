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
      password_confirmation: '',
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
    const { username, email, password, password_confirmation } = this.state;

    axios
      .post('/api/users/register', {
        username: username,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      })
      .then((response) => {
        console.log(response.data);
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
                  Your name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  name="username"
                  value={this.state.name}
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
              <label htmlFor="password_confirmation" className="grey-text">
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                className="form-control"
                value={this.state.password_confirmation}
                onChange={this.onChange}
              />
              <div className="text-center mt-4">
                <Button color="indigo" type="submit" className="white-text">
                  Register
                </Button>
              </div>
              {message}
            </form>
          </Col>
        </Row>
      </Container>
    );
  }
}

//this.props.history.push('/dashboard')