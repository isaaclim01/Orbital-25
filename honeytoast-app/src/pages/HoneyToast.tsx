import Navbar from '../components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Flight from './Flight';
import Accommodation from './Accommodation';
import Itinerary from './Itinerary';
import Calendar from './Calendar';

function HoneyToast() {
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

export default HoneyToast;