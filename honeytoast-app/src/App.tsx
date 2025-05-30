import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Flight from './pages/Flight';
import Accommodation from './pages/Accommodation';
import Itinerary from './pages/Itinerary';
import Calendar from './pages/Calendar';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
      
      <div className="navbar">
        < Navbar />
      </div>
      <div>
            <Routes>
              <Route path="/"  element={<Home />}  />
              <Route path="/flight"  element={<Flight />} />
              <Route path="/accommodation" element={<Accommodation />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>   
      </div>
    </div>
     </BrowserRouter>
  );
}

export default App;
