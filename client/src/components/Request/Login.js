import React, {Component} from 'react';
import axios from 'axios';
import Register from './Register';
//import './App.css';

export default class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            loginError: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleSubmit.bind(this);
        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    }

    handleSuccessfulAuth(data) {
        this.props.handleLogin(data);
        //this.props.history.push("/dashboard");
    }
    

    handleChange(event){
        this.setSate({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event){
        const { email, password} = this.state;

        axios
            .post(
                "/api/users/login",
                {
                    user:{
                        email: email,
                        password: password
                    }
                },
                {withCredentials: true}
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
          <div>
            <Register handleSuccessfulAuth={this.handleSuccessfulAuth} />
            <form onSubmit={this.handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
    
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
    
              <button type="submit">Login</button>
            </form>
          </div>
        );
      }
};
