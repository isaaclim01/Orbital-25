import Navbar from '../components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Flight from './FlightPages/Flight';
import List from './hotelSearch/List';
import Itinerary from './Itinerary';
import Calendar from './Calendar';
import './HoneyToast.css';
import { supabase } from '../App';
import { Session } from '@supabase/supabase-js';
import Trips from './Trips';
import OutboundFlightSelection from './FlightPages/OutboundFlightSelection';
import Hotel from './hotel/Hotel';
import ReturnFlightSelection from './FlightPages/ReturnFlightSelection';
import FlightConfirmation from './FlightPages/FlightConfirmation';

interface HoneyToastProps {
  user: Session['user'];
}

function HoneyToast({user}: HoneyToastProps) {

  async function signOut() {
    const { error } = await supabase.auth.signOut()
  }

  return (
    <BrowserRouter>
      <div className="App">

        <div className="navbar">
          < Navbar />
        </div>

        <div id="logout">
          <button onClick={signOut}>Logout</button>
        </div>

        <div>
          <Routes>
            <Route path="/" element={<Home user={user}/>} />
            <Route path="/trips" element={<Trips user={user}/>} />
            <Route path="/flight" element={<Flight user={user}/>} />
            <Route path="/accommodation" element={<List />} />
            <Route path="/hotels/:id" element={<Hotel user={user}/>} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/outbound-flight-selection" element={<OutboundFlightSelection user={user}/>} />
            <Route path="/return-flight-selection" element={<ReturnFlightSelection user={user}/>} />
            <Route path="/flight-confirmation" element={<FlightConfirmation user={user}/>} />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default HoneyToast;