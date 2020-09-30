import React, { useContext }  from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AvailableRequests from './components/PublicRequest/AvailableRequests';
import CreatePublicRequest from './components/PublicRequest/CreatePublicRequest';
import ClaimedRequests from './components/PublicRequest/ClaimedRequests';
import MyFavors from './components/Favor/MyFavors';
import AddFavor from './components/Favor/AddFavor';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import PublicRoute from './components/Auth/PublicRoute';
import NotFoundPage from './components/Auth/NotFoundPage';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Layout } from './components/Layout';
import { AuthContext } from './context/AuthContext';

const App = () => {
    return (
        <Router>
          <NavBar />
          <Layout>
            <Switch>
              <Route exact path="/" component={AvailableRequests} />
              <ProtectedRoute path="/createPublicRequest" component={CreatePublicRequest} />
              <ProtectedRoute path="/myClaimedRequests" component={ClaimedRequests} />
              <ProtectedRoute path="/myFavors" component={MyFavors} />
              <ProtectedRoute path="/addFavor" component={AddFavor} />
              <PublicRoute path="/login" component={Login} />
              <PublicRoute path="/register" component={Register} />
              <Route component={NotFoundPage} />
            </Switch>
          </Layout>
        </Router>
    );
}

export default App;
