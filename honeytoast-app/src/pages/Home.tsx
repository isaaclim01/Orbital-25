import { Session } from "@supabase/supabase-js";
import { CiLocationOn, CiViewList } from "react-icons/ci";
import "./Home.css"
import { PiAirplaneTakeoffLight } from "react-icons/pi";
import { FaBed } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

interface HomeProps {
  user: Session['user'];
}

function Home({ user }: HomeProps) {
  const getUsername = () => {
    const atIndex = user.email?.indexOf('@');
    return user.email?.slice(0, atIndex);
  }

  return (
    <div className="home-container">
      <div id="welcome">
        <h1>Welcome back, <strong>{getUsername()}</strong>!</h1>
        <p className="subtitle">What would you like to do today?</p>
      </div>

      <main className="quickstart-guide">
        <h2>Quick Start</h2>
        <div className="quickstart-grid">
          {/* Trip Planning Section */}
          <div className="quickstart-card" onClick={() => window.location.href = '/trips'}>
            <div className="card-icon">
              <CiLocationOn size="40" />
            </div>
            <h3>My Trips</h3>
            <p>View and manage your upcoming trips</p>
          </div>

          {/* Flight Section */}
          <div className="quickstart-card" onClick={() => window.location.href = '/flight'}>
            <div className="card-icon">
              <PiAirplaneTakeoffLight size="40" />
            </div>
            <h3>Flight Details</h3>
            <p>Add or check your flight information</p>
          </div>

          {/* Accommodation Section */}
          <div className="quickstart-card" onClick={() => window.location.href = '/accommodation'}>
            <div className="card-icon">
              <FaBed size="40" />
            </div>
            <h3>Accommodation</h3>
            <p>Manage your hotel and lodging details</p>
          </div>

          {/* Itinerary Section */}
          <div className="quickstart-card" onClick={() => window.location.href = '/itinerary'}>
            <div className="card-icon">
              <CiViewList size="40" />
            </div>
            <h3>Itinerary</h3>
            <p>Plan your daily activities</p>
          </div>

          {/* Calendar Section */}
          <div className="quickstart-card" onClick={() => window.location.href = '/calendar'}>
            <div className="card-icon">
              <FaCalendarAlt size="40" />
            </div>
            <h3>Calendar</h3>
            <p>View your trip timeline</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home;