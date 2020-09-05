import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
      <React.Fragment>
        <Router>
          <Switch>
            <Route exact path="/" component={PublicRequestPage}/>
            <Route path="/createPublicRequest" component= {CreatePublicRequestPage}/>
            <Route path="/login" component= {Login}/>
            <Route path="/register" component= {Register}/>
          </Switch>


          
        {/* <div className="App">
          <NavBar />
          <Switch>
            <Route path="/" component={PublicRequestPage} exact />
            <Route
              path="/createPublicRequest"
              component={CreatePublicRequestPage}
            />
          </div>
        </div> */}
      </Router>
      </React.Fragment>
    );
  }
}

export default App;
