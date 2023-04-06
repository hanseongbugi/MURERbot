// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from './components/SignUp';
import Chat from './components/Chat';

function App() {
  return (
    <div className="App">
    
   
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/signup" element={<SignUp />}/>
      <Route path="/chat" element={<Chat />}/>
    </Routes>
  

    </div>
  );
}

export default App;
