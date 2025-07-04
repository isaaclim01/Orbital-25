import { useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import {Booking} from "./Flight";
import "./OutboundFlightSelection.css";

// just for testing purposes
import { api_response } from "./apiresponse";
import { useState } from "react";

interface OutboundFlightSelectionProps {
  user: Session['user'];
}

function OutboundFlightSelection({ user }: OutboundFlightSelectionProps) {
  const [message, setMessage] = useState<string | undefined>(); 

  // const location = useLocation();
  // const state = location.state as {
  //   booking: Booking;
  //   api_response: any;
  // }

  // const apiResponse = state?.api_response;

  // console.log("API Response:", JSON.stringify(apiResponse, null, 2));

  const apiResponse = api_response;

  if (apiResponse === undefined || apiResponse === null) {
    return (
      <div>
        <h2>Error</h2>
        <p>There was an API error retrieving flight information. Please try again later.</p>
      </div>
    )
  } else if (apiResponse.hasOwnProperty("error")) {
    return (
      <div>
        <h2>Error: Google Flights returns no results</h2>
        <p>Please adjust your trip inputs and try again.</p>
        <p>Possible issues: Outbound and Return date are too far apart (eg. more than 1 month)</p>
      </div>
    )
  } else if (!apiResponse.hasOwnProperty("best_flights")) {
    return (
      <div>
        <h2>No Flights Found</h2>
        <p>Sorry, we couldn't find any flights matching your criteria.</p>
      </div>
    )
  }

  const bookFlight = (departureToken: string) => {

    setMessage("Please wait while we retrieve return flight information...");
  }


  return (
    <>
      <h1>
        Outbound Flight Selection
      </h1>

      <h3>
        Select your preferred outbound flight from the options below:
      </h3>

      <div>
         <table>
            <thead>
                <tr>
                    <th>Flight Number: </th>
                    <th>Departure: </th>
                    <th>Arrival: </th>
                    <th>Price: </th>
                    <th>Layovers: </th>
                    <th>Airline: </th>
                    <th>Book now:</th>
                </tr>
            </thead>
            <tbody>
               {apiResponse["best_flights"].map((flight: any, index: number) => {
                return (<tr key={index}>
                  <td>{flight["flights"][0]["flight_number"]}</td>
                  <td><strong>{flight["flights"][0]["departure_airport"]["name"]}</strong> <br/> {flight["flights"][0]["departure_airport"]["time"]}</td>
                  <td><strong>{flight["flights"][flight["flights"].length - 1]["arrival_airport"]["name"]}</strong> <br/> {flight["flights"][flight["flights"].length - 1]["arrival_airport"]["time"]}</td>
                  <td>{flight.price} USD </td>
                  <td>{flight["flights"].length}</td>
                  <td>{flight["flights"][0]["airline"]}</td>
                  {/* function has to take in the departure token */}
                  <td><button onClick={() => bookFlight(flight["departure_token"])}>Book</button></td>
                </tr>)
               })}
            </tbody>
        </table>
      </div>
      <div>{message}</div>
    </>
  )
}

export default OutboundFlightSelection
