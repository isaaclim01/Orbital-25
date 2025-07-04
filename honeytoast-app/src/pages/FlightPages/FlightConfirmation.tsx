import React from 'react'
import { Session } from "@supabase/supabase-js";
import { useLocation } from 'react-router-dom';
import "./FlightConfirmation.css";

interface FlightConfirmationProps {
    user: Session['user'];
}

function FlightConfirmation({ user }: FlightConfirmationProps) {
  return (
    <div>
      This is the flight confirmation page.
    </div>
  )
}

export default FlightConfirmation
