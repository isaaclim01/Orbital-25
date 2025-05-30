import React, { useState } from 'react'
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link, Route, Routes } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import Home from '../pages/Home';
import Flight from '../pages/Flight';
import Accommodation from '../pages/Accommodation';
import Itinerary from '../pages/Itinerary';
import Calendar from '../pages/Calendar';

function Navbar() {

    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
        
    return (
        <>
        <div className="navbar">
                <Link to="#">
                    <FaBarsStaggered size="25" color="#1E8449" onClick={showSidebar}/>
                </Link>
        </div>
        <div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <Link to="#" className='menu-bars'>
                            <IoIosCloseCircleOutline size="25"/>
                        </Link>
                    </li>
                {SidebarData.map((item, index) => {
                        return (
                            <li className={item.cName} key={index}>
                                <Link to={item.path}>
                                    {item.icon} 
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                })}
                </ul>
            </nav>
            <Routes>
              <Route path="/" element={<Home />}  />
              <Route path="/flight" element={<Flight />} />
              <Route path="/accommodation" element={<Accommodation />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
        </div>
        </>
    )
}

export default Navbar;