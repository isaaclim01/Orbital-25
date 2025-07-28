import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react';

// import { Dialog } from "@headlessui/react";

import api from '../api';
import './Calendar.css';

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
  id: string,
  title: string,
  start: string,
  end: string,
  description?: string,
  location?: string;
}

interface NewEvent {
  title: string,
  start: string,
  end: string,
  description?: string,
  location?: string;
}

interface deleteEvent {
  id: string
}

function Calendar({user} : CalendarProps) {

  const [events, setEvents] = useState<CalendarEvent[] | undefined>([]);
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [buttonName, setButtonName] = useState("Add New Event")
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {getCalendarInfo()}, []);
  
  const getCalendarInfo = async () => {
    try {
      const response = await api.get("/nylas/calendars")
      const data = response.data

      console.log("Response:", JSON.stringify(data, null, 2))
      
      // make the date timing to 2359
      const isoString = ((date : any) => {
        const d = new Date(date);
        d.setHours(23, 59, 0, 0);
        return d.toISOString();
      });

      const formattedEvents : CalendarEvent[] = data.map((event: any) : CalendarEvent => ({
        id: event.id,
        title: event.title || "No Title",
        start: event.when?.start_time ? 
          new Date(event.when.start_time * 1000).toISOString() : 
          event.when?.start_date ?
            event.when.start_date :
            event.when.date,
        end: event.when?.end_time ? 
          new Date(event.when.end_time * 1000).toISOString() :
          event.when?.end_date ?
            isoString(event.when.end_date) :
            event.when.date,
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

  const onInputChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }
  const onInputChangeStartDate = (e: ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  }
  const onInputChangeEndDate = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  }
  const onInputChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }
  const onInputChangeLocation = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  }

  const resetInputFields = () => {
    setTitle("");
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date().toISOString().split('T')[0]);
    setDescription("");
    setLocation("");
  }

  const handleEventClick = (eventInfo : any) =>  {
    console.log(eventInfo)

    const { id, title, start, end, extendedProps } = eventInfo.event;
    setSelectedEvent({
      id,
      title,
      start: start?.toISOString() ?? "",
      end: end?.toISOString() ?? start?.toISOString() ?? "",
      description: extendedProps.description,
      location: extendedProps.location,
    });
  }

  const addEvent = async(eventInfo: NewEvent) => {
    const response = await api.post("/nylas/calendars", eventInfo);

    if (response.data.hasOwnProperty("error")) {
      throw new Error(response.data["error"]);
    }

    return response.data;
  }

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.length === 0) {
      setMessage("Title field is empty.")
      return;
    }
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > start || now > end) {
      setMessage("Dates must be in the future!");
      return;
    } else if (end < start) {
      setMessage("End date must be after Start date")
      return;
    }

    try {
      const calendarEvent : NewEvent = {
        title,
        start: startDate,
        end: endDate,
        description,
        location
      }
      setMessage("Adding event...")
      const response = await addEvent(calendarEvent);
      setMessage("Success!")
      window.location.reload();
    } catch (error) {
      console.error("Error in adding event: ", error);
      setMessage("Failed to add event due to internal server error, try again later.")
    }
  }
  
  const [deleteMessage, setDeleteMessage] = useState("")

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (selectedEvent != null) {
      try {
        const deleteEventInfo : deleteEvent = {id: selectedEvent.id}
        setDeleteMessage("Deleting event...")
        const response = await api.delete("/nylas/calendars", {data: deleteEventInfo})
        setDeleteMessage("Success!")
        window.location.reload();
      } catch (error) {
        console.error("Error in adding event: ", error);
        setDeleteMessage("Failed to delete event due to internal server error, try again later.")
      }
    }

    return;
  }

  return (
    <>
      <div className="calendar-layout">
        <div className="my-calendar-wrapper">
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
        </div>
        <div className="event-info">
          <button className="add-event-button" 
            onClick={() => {
               if (showAddEvent) {
                  resetInputFields();
               }
              setShowAddEvent(!showAddEvent);
              setButtonName(!showAddEvent ? "Return to Calendar" : "Add New Event");
            }}>{buttonName}
          </button>

          {showAddEvent ? (
            <>
              <h3><strong>Add Event</strong></h3>
              <form id="flight-search" onSubmit={handleSubmit}>

                <label htmlFor="text">Event Title: </label>
                <input
                  type="text"
                  value={title}
                  required
                  id="title"
                  name="EventTitle"
                  placeholder="eg. Thailand Trip"
                  onChange={onInputChangeTitle} />
                <br />

                <label htmlFor="start_date">Start Date:  </label>
                <input
                    type="date"
                    value={startDate}
                    required
                    id="start_date"
                    name="Start Date"
                    onChange={onInputChangeStartDate} />
                <br />

                <label htmlFor="end_date">End Date:  </label>
                <input
                    type="date"
                    value={endDate}
                    required
                    id="end_date"
                    name="End Date"
                    onChange={onInputChangeEndDate} />
                <br />

                <label htmlFor="description">Description: </label>
                <input
                  type="text"
                  value={description}
                  id="description"
                  name="Description"
                  onChange={onInputChangeDescription} />
                <br />

                <label htmlFor="location">Location: </label>
                <input
                  type="text"
                  value={location}
                  id="location"
                  name="Location"
                  onChange={onInputChangeLocation} />
                <br />
                <br />
                  
                <button type="submit"> Add to Calendar </button>

              </form>
              <br/>
              <strong>
                {message}
              </strong>
            </>
          )
          : selectedEvent ? (
          <div style={{ padding: "1rem", marginTop: "1rem" }}>
            {/* <h3><strong>Event Information</strong></h3> */}
            <h3>{selectedEvent.title}</h3>
            <p><strong>Start:</strong> {selectedEvent.start.split('T')[0].toString() + "  "} 
              {new Date(selectedEvent.start).toLocaleString("en-SG", {
                  timeZone: "Asia/Singapore",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              }</p>
            <p><strong>End:</strong> {selectedEvent.end.split('T')[0].toString() + "  "}
              {new Date(selectedEvent.end).toLocaleString("en-SG", {
                  timeZone: "Asia/Singapore",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
              }</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            {/* <button>Update</button> */}
            <button onClick={handleDelete}>Delete</button>
            <p><strong>{deleteMessage}</strong></p>
          </div>
          ) : (<p><strong>No Event Selected</strong></p>)}
      </div>


     </div>
    </>
  )
}

export default Calendar
