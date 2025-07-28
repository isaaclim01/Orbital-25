import { FaHome, FaBed, FaCalendarAlt } from "react-icons/fa";
import { PiAirplaneTakeoffLight } from "react-icons/pi";
import { CiViewList, CiLocationOn } from "react-icons/ci";
import { IoMdBook } from "react-icons/io";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <FaHome size="25" />,
        cName: 'nav-text'
    },
    {
        title: 'My Trips',
        path: '/trips',
        icon: <CiLocationOn size="25" />,
        cName: 'nav-text'
    },
    {
        title: 'My Bookings',
        path: '/bookings',
        icon: <IoMdBook size="25" />,
        cName: 'nav-text'
    },
    {
        title: 'Flight',
        path: '/flight',
        icon: <PiAirplaneTakeoffLight size="25" />,
        cName: 'nav-text'
    },
    {
        title: 'Accommodation',
        path: '/accommodation',
        icon: <FaBed size="25" />,
        cName: 'nav-text'
    },
    {
        title: 'Itinerary',
        path: '/itinerary',
        icon: <CiViewList size="25" />,
        cName: 'nav-text'
    },
    {
        title: 'Calendar',
        path: '/calendar',
        icon: <FaCalendarAlt size="25" />,
        cName: 'nav-text'
    },
]