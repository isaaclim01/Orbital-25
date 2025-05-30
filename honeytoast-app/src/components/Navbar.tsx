import React, { useState } from 'react'
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link, Route, Routes } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { GiButterToast } from "react-icons/gi";


function Navbar() {

    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
        
    return (
        <>
        <div className="navbar">
                <Link to="#">
                    <FaBarsStaggered className="fabar" size="25" onClick={showSidebar}/>
                </Link>
                <h1 className="app-name">
                    HoneyToast <GiButterToast size ="25px"/>
                </h1>
        </div>
        <div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items'>
                    <li className='navbar-toggle'>
                        <Link to="#" className='menu-bars'>
                            <IoIosCloseCircleOutline color="#f5f5f5" size="35" onClick={showSidebar}/>
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
        </div>
        </>
    )
}

export default Navbar;