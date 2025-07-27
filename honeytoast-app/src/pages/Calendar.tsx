import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from 'react';

import api from '../api';


interface CalendarProps {
  user: Session['user']
}

interface CalendarEvent {
  id: string,
  title: string,
  start: string,
  end: string,
  extendedProps : {
    description?: string,
    location?: string
  }
}

interface SelectedEvent {
  title: string,
  start: string,
  end: string,
  description?: string,
  location?: string;
}

function Calendar({user} : CalendarProps) {

  const [events, setEvents] = useState<CalendarEvent[] | undefined>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);


  useEffect(() => {getCalendarInfo()}, []);
  
  const getCalendarInfo = async () => {
    try {
      const response = await api.get("/nylas/calendars")
      const data = response.data

      const formattedEvents : CalendarEvent[] = data.map((event: any) : CalendarEvent => ({
        id: event.id,
        title: event.title || "No Title",
        start: new Date(event.when.start_time * 1000).toISOString(),
        end: new Date(event.when.end_time * 1000).toISOString(),
        extendedProps: {
          description: event.description || "NIL",
          location: event.location || "NIL",
        }
      }))
      setEvents(formattedEvents)
    } catch (error) {
      console.error("Failed to get Calendar Info: ", error)
    }
  }

  const handleEventClick = (eventInfo : any) =>  {
    console.log(eventInfo)

    const { title, start, end, extendedProps } = eventInfo.event;
    setSelectedEvent({
      title,
      start,
      end,
      description: extendedProps.description,
      location: extendedProps.location,
    });
  }

  return (
    <>
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
      eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short", // Shows "am"/"pm" instead of "a"/"p"
          hour12: true
      }}
      eventClick={handleEventClick}
    // {[
    //   { title: 'event 1', date: '2025-07-28' },
    //   { title: 'event 2', date: '2025-07-29' },
    //   { title: 'event 3', start: '2025-07-30', end: '2025-07-30' },
    // ]}
    />
    {selectedEvent && (
  <div style={{ padding: "1rem", background: "#f0f0f0", marginTop: "1rem" }}>
    <h3>{selectedEvent.title}</h3>
    <p><strong>Start:</strong> {selectedEvent.start.toString()}</p>
    <p><strong>End:</strong> {selectedEvent.end.toString()}</p>
    <p><strong>Description:</strong> {selectedEvent.description}</p>
    <p><strong>Location:</strong> {selectedEvent.location}</p>
  </div>
)}
    </>
  )
}

export default Calendar
