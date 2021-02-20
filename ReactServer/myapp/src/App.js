import React from 'react';
import 'office-ui-fabric-react/dist/css/fabric.css';
import './App.css';
import Background from './components/background'
import { BrowserRouter as Router, Switch, Route, Link, } from "react-router-dom";

import SignIn from './components/signIn';
import SignUp from './components/signUp';
import Home from './components/Home';
import Onboarding from './components/onboarding';
import manageAccount from './components/manageAccount';
import CEMainPage from './components/CEMainPage';

function App() {
  return (<Background>
    <Router>
      <Switch>
        <Route path="/signIn" component={SignIn}>
        </Route>
        <Route path="/signUp" component={SignUp}>
        </Route>
        <Route path="/Onboarding" component={Onboarding}>CEMainPage
        </Route>
        <Route path="/manageAccount" component={manageAccount}>
        </Route>
        <Route path="/CEMainPage" component={CEMainPage}>
        </Route>
        <Route path="/" component={Home}>
        </Route>
      </Switch>
    </Router>
    </Background>
  );
}

export default App;