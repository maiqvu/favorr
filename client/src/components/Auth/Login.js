import React, {Component} from 'react';
import axios from 'axios';
import {Container, Row, Col, Button} from 'react-bootstrap';

export default class Login extends Component{
    constructor(){
        super();

        this.state = {
            email: "",
            password: "",
            errors: "",
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
   
    onChange(event){
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmit(event){
        event.preventDefault();
        const { email, password} = this.state;

        axios
            .post(
                '/api/users/login',{
                    email: email,
                    password: password
                },
            )
            .then(response => {
                console.log(response.data);
            })
            .catch(error=>{
                this.setState({errors: error.response.data})
                console.log("login Error", error);
            })
    }

    render() {
        let { errors,  } = this.state;
        let message;

        if (Array.isArray(errors.message)) {
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
                <Col lg="6" md="6" sm="8">
                    <form onSubmit={this.onSubmit}>
                    <p className="h4 text-center mb-4">Sign In</p>
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

                    <div className="form-group">
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
                    </div>
                    
                    <div className="text-center mt-4">
                        <Button color="indigo" type="submit" className="white-text pl-3 pr-3">Login</Button>
                    </div>
                    {message}
                    </form>
                    <p className="font-small grey-text d-flex justify-content-end">
                        Not a member?
                        <a href="/register" className="blue-text ml-1">Sign up</a>
                    </p>
                </Col>
                </Row>
                
            </Container>
        );
      }
};
