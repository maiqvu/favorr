import React, {Component} from 'react';
import axios from 'axios';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput } from 'mdbreact';
import 'mdbreact/dist/css/mdb.css';

export default class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            loginError: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
   
    handleChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event){
        const { email, password} = this.state;

        axios
            .post(
                "/api/users/login",
                {
                    email: email,
                    password: password
                },
            )
            .then(response => {
                //
                console.log("res from login ", response);
                console.log("res status ", response.data.status);
            })
            .catch(error=>{
                console.log("login Error", error);
            })
        event.preventDefault();
    }

    render() {
        return (
            <MDBContainer>
                <MDBRow>
                <MDBCol md="3"></MDBCol>
                <MDBCol md="6">
                    <form onSubmit={this.handleSubmit}>
                    <p className="h4 text-center mb-4">Sign In</p>
                    <MDBInput
                        label="Email" 
                        type="email"
                        id="email" 
                        name="email" 
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                        className="form-control" 
                    />

                    <MDBInput
                        label="Password" 
                        type="password" 
                        id="password" 
                        name="password"
                        className="form-control" 
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                    />
                    <div className="text-center mt-4">
                        <MDBBtn color="indigo" type="submit" className="white-text pl-3 pr-3">Login</MDBBtn>
                    </div>
                    </form>
                    <p className="font-small grey-text d-flex justify-content-end">
                        Not a member?
                        <a href="/register" className="blue-text ml-1">Sign up</a>
                    </p>
                </MDBCol>
                <MDBCol md="3"></MDBCol>
                </MDBRow>
                
            </MDBContainer>
        );
      }
};
