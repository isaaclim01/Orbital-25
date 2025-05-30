import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Flight from './pages/Flight';
import Accommodation from './pages/Accommodation';
import Itinerary from './pages/Itinerary';
import Calendar from './pages/Calendar';

function App() {
  return (
    <div className="App">
      
      <div className="navbar">
        <BrowserRouter>
            < Navbar />
            <Routes>
              <Route path="/" element={<Home />}  />
              <Route path="/flight" element={<Flight />} />
              <Route path="/accommodation" element={<Accommodation />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/calendar" element={<Calendar />} />
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
