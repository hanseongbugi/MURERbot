import React from 'react';
import { Routes, Route } from "react-router-dom";
import Intro from './components/Intro';
import Login from "./components/Login";
import SignUp from './components/SignUp';
import Chat from './components/Chat';
import PrivateRoute from "./components/auth/PrivateRoute";
import InfoWindow from './components/menu/InfoWindow';



function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<Intro />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/signup" element={<SignUp />}/>
      <Route path="/chat" element={<PrivateRoute component={Chat}/>}/>
      <Route path="/chat/infoWindow" element={<InfoWindow/>}/>
      <Route path="*" element={<PrivateRoute component={Chat} />}/>
    </Routes>
  

    </div>
  );
}

export default App;
