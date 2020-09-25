import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AvailablePublicRequests from './components/PublicRequest/AvailablePublicRequests';
import CreatePublicRequest from './components/PublicRequest/CreatePublicRequest';
import MyClaimedRequests from './components/PublicRequest/MyClaimedRequests';
import MyFavors from './components/Favor/MyFavors';
import AddFavor from './components/Favor/AddFavor';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Layout } from './components/Layout';

const App = () => {
    return (
        <Router>
          <NavBar />
          <Layout>
            <Switch>
              <Route exact path="/" component={AvailablePublicRequests} />
              <Route path="/createPublicRequest" component={CreatePublicRequest} />
              <Route path="/myClaimedRequests" component={MyClaimedRequests} />
              <Route path="/myFavors" component={MyFavors} />
              <Route path="/addFavor" component={AddFavor} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
            </Switch>
          </Layout>
        </Router>
    );
}

export default App;
