import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CreatePublicRequestPage from './components/Request/CreatePublicRequestPage';
import PublicRequestPage from './components/Request/PublicRequestPage';
import NavBar from './NavBar';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <div>
            <Route path="/" component={PublicRequestPage} exact />
            <Route
              path="/createPublicRequest"
              component={CreatePublicRequestPage}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
