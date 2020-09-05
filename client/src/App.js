import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CreatePublicRequestPage from './components/Request/CreatePublicRequestPage';
import PublicRequestPage from './components/Request/PublicRequestPage';
import Login from './components/Request/Login';
import Register from './components/Request/Register';
import NavBar from './NavBar';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Switch>
            <Route path="/" component={PublicRequestPage} exact />
            <Route path="/createPublicRequest" component={CreatePublicRequestPage}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" commponent={Register}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
