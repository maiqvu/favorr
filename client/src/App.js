import React, { useContext }  from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AvailablePublicRequests from './components/PublicRequest/AvailablePublicRequests';
import CreatePublicRequest from './components/PublicRequest/CreatePublicRequest';
import MyClaimedRequests from './components/PublicRequest/MyClaimedRequests';
import MyFavors from './components/Favor/MyFavors';
import AddFavor from './components/Favor/AddFavor';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import NotFoundPage from './components/Auth/NotFoundPage';
import NavBar from './NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Layout } from './components/Layout';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const {isLogged, isAuthenticated} = useContext(AuthContext);

    return (
        <Router>
          <NavBar />
          <Layout>
            <Switch>
              <Route exact path="/" component={AvailablePublicRequests} />
              <ProtectedRoute path="/createPublicRequest" component={CreatePublicRequest} />
              <ProtectedRoute path="/myClaimedRequests" component={MyClaimedRequests} />
              <ProtectedRoute path="/myFavors" component={MyFavors} />
              <ProtectedRoute path="/addFavor" component={AddFavor} />
              {(!isLogged && !isAuthenticated)? <Route path="/login" component={Login} /> : <Route path="/" component={AvailablePublicRequests} />}
              {(!isLogged && !isAuthenticated)? <Route path="/register" component={Register} /> : <Route path="/" component={AvailablePublicRequests} />}
              <Route component={NotFoundPage} />
            </Switch>
          </Layout>
        </Router>
    );
}

export default App;
