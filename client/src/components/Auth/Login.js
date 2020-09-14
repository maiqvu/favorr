import React, {Component} from 'react';
import axios from 'axios';
import {Container, Row, Col, Button} from 'react-bootstrap';

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
            <Container>
                <Row>
                <Col md="3"></Col>
                <Col md="6">
                    <form onSubmit={this.handleSubmit}>
                    <p className="h4 text-center mb-4">Sign In</p>
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
                        placeholder="Enter email"
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
                        placeholder="Enter password"
                    />
                    <div className="text-center mt-4">
                        <Button color="indigo" type="submit" className="white-text pl-3 pr-3">Login</Button>
                    </div>
                    </form>
                    <p className="font-small grey-text d-flex justify-content-end">
                        Not a member?
                        <a href="/register" className="blue-text ml-1">Sign up</a>
                    </p>
                </Col>
                <Col md="3"></Col>
                </Row>
                
            </Container>
        );
      }
};
