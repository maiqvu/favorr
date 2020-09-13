import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AvailablePublicRequests from './components/PublicRequest/AvailablePublicRequests';
import CreatePublicRequest from './components/PublicRequest/CreatePublicRequest';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NavBar from './NavBar';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'mdbreact/dist/css/mdb.css';

import { Layout } from './components/Layout';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <NavBar />
          <Layout
          ><Switch>
              <Route exact path="/" component={AvailablePublicRequests} />
              <Route path="/createPublicRequest" component={CreatePublicRequest} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </Switch>
          </Layout>

        </Router>
      </React.Fragment>
    );
  }
}

export default App;
