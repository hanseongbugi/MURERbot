// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from './components/SignUp';

function App() {
  return (
    <div className="App">
    
   
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/signup" element={<SignUp />}/>
    </Routes>
  

    </div>
  );
}

export default App;
