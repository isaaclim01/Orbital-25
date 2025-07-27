import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from 'react';

import api from '../api';


interface CalendarProps {
  user: Session['user']
}

function Calendar({user} : CalendarProps) {

  const [events, setEvents] = useState([]);

  useEffect(() => {getCalendarInfo()}, []);
  
  const getCalendarInfo = async () => {
    try {
      const response = await api.get("/nylas/calendars")
      const data = response.data
      console.log("response:" + JSON.stringify(data, null , 2));

      setEvents(data)
    } catch (error) {
      console.error("Failed to get Calendar Info: ", error)
    }
  }

  return (
    <FullCalendar
      plugins={[ dayGridPlugin, multiMonthPlugin ]}
      initialView="dayGridMonth"
      headerToolbar={{
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,multiMonthYear',
    }}
    views={{
    multiMonthYear: {
      type: 'multiMonth',
      duration: { months: 12 },
    },
    }}
     buttonText={{
    dayGridMonth: 'Month',
    multiMonthYear: 'Year'
    }}
    events={events}
    // {[
    //   { title: 'event 1', date: '2025-07-28' },
    //   { title: 'event 2', date: '2025-07-29' },
    //   { title: 'event 3', start: '2025-07-30', end: '2025-07-30' },
    // ]}
    />
  )
}

export default Calendar
