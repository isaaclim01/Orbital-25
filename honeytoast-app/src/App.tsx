import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Flight from './pages/Flight';
import Hotel from './pages/Accomodation';

function App() {
  return (
    <div className="App">
      
      <div className="navbar">
        <BrowserRouter>
            < Navbar />
            <Routes>
              <Route path="/" element={<Link to="/home"></Link>} />
              <Route path="/home" element={<Home />} />
              <Route path="/flight" element={<Flight />} />
              <Route path="/hotel" element={<Hotel />} />
            </Routes>
        </BrowserRouter>
        
      </div>

      <header> 
        HoneyToast
      </header>

      <div>
        Need to make the website
      </div>
    </div>
  );
}

export default App;
