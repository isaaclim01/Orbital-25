import React from 'react';
import { FaHome, FaBed, FaCalendarAlt } from "react-icons/fa";
import { PiAirplaneTakeoffLight } from "react-icons/pi";
import { CiViewList } from "react-icons/ci";

export const SidebarData = [
    {
        title: 'Home',
        path:'/',
        icon: <FaHome size="25"/>,
        cName: 'nav-text'
    },
        {
        title: 'Flight',
        path:'/flight',
        icon: <PiAirplaneTakeoffLight size="25"/>,
        cName: 'nav-text'
    },
        {
        title: 'Accomodation',
        path:'/accomodation',
        icon: <FaBed size="25"/>,
        cName: 'nav-text'
    },
        {
        title: 'Itinerary',
        path:'/itinerary',
        icon: <CiViewList size="25"/>,
        cName: 'nav-text'
    },
        {
        title: 'Calendar',
        path:'/calendar',
        icon: <FaCalendarAlt size="25"/>,
        cName: 'nav-text'
    },
]