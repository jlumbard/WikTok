import React from 'react';
import 'office-ui-fabric-react/dist/css/fabric.css';
import './App.css';
import Background from './components/background'

import SignIn from './components/signIn';

function App() {
  return (
  <div >

<Background><SignIn></SignIn></Background>

  </div>
  );
}

export default App;