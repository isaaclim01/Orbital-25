import React from 'react';
import { canHaveModifiers, classicNameResolver } from 'typescript';
import { FaHome, FaBed } from "react-icons/fa";
import { PiAirplaneTakeoffLight } from "react-icons/pi";
import { CiViewList } from "react-icons/ci";

export const SidebarData = [
    {
        title: 'Home',
        path:'/',
        icon: <FaHome size="30"/>,
        cName: 'nav-text'
    },
        {
        title: 'Flight',
        path:'/Flight',
        icon: <PiAirplaneTakeoffLight size="30"/>,
        cName: 'nav-text'
    },
        {
        title: 'Accomodation',
        path:'/Accomodation',
        icon: <FaBed />,
        cName: 'nav-text'
    },
        {
        title: 'Itinerary',
        path:'/Itinerary',
        icon: <CiViewList />,
        cName: 'nav-text'
    },
]