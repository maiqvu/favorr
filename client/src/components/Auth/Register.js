import React, { Component } from "react";
import axios from "axios";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      password_confirmation: "",
      registrationErrors: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    const { email, password , password_confirmation} = this.state;

    axios
      .post(
        "/api/users/register",
        {
          email: email,
          password: password,
          // password_confirmation: password_confirmation
        }
      )
      .then(response => {
        if (response.data.status === "created") {
          this.props.handleSuccessfulAuth(response.data);
        }
      })
      .catch(error => {
        console.log("registration error", error);
      });
    event.preventDefault();
  }

  render() {
    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol md="3"></MDBCol>
          <MDBCol md="6">
            <form onSubmit={this.handleSubmit}>
              <p className="h4 text-center mb-4">Register</p>
              <label htmlFor="email" className="grey-text">
                Your email
              </label>
              <input 
                type="email"
                id="email" 
                name="email" 
                value={this.state.email}
                onChange={this.handleChange}
                required
                className="form-control" 
              />
              <br />
              <label htmlFor="password" className="grey-text">
                Your password
              </label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-control" 
                value={this.state.password}
                onChange={this.handleChange}
                required
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
                onChange={this.handleChange}
                required
              />
              <div className="text-center mt-4">
                <MDBBtn color="indigo" type="submit" className="white-text">Register</MDBBtn>
              </div>
            </form>
          </MDBCol>
          <MDBCol md="3"></MDBCol>
        </MDBRow>
        
      </MDBContainer>
    );
  }
}