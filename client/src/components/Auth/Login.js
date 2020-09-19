import React, {Component} from 'react';
import axios from 'axios';
import {RouterComponentProps} from 'react-router-dom'; 
import CookieService from '../../context/CookieService';
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
                //console.log(response.data);
                let {token, _id, name} = response.data;
                this.handleLoginSuccess(token, _id, name);
            })
            .catch((err)=>{
                this.setState({ errors: err.response.data });
                console.log("Login Error", err);
            });
    }

    handleLoginSuccess(token, _id, name){
        let expiresAt = 60;
        let date = new Date();
        date.setTime(date.getTime() + (expiresAt*60 * 1000)); //60 seconds * 60 mins * 1000 miliseconds = 1 hour
        const options = {
            path:'/', 
            expires: date
        };

        try{
            CookieService.set('access_token', token, options);
            CookieService.set('ID', _id, options);
            CookieService.set('name', name, options);
        }
        catch (e){
            console.log("Cookie Error: ", e);
        };
        

        this.props.history.push('/'); //Redirect Back to Dashboard
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
