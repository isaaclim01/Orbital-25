import React from 'react'
import { Session } from "@supabase/supabase-js";
import { useLocation } from 'react-router-dom';
import { Booking } from './Flight';
import { FlightDetails } from './OutboundFlightSelection';

// For testing purposes
import { return_api_response } from './apiresponse';
import "./ReturnFlightSelection.css";

interface ReturnFlightSelectionProps {
  user: Session['user'];
}

function ReturnFlightSelection({user}: ReturnFlightSelectionProps) {
  const location = useLocation();
  const state = location.state as {
    booking: Booking;
    api_response: any;
    departureFlightDetails: FlightDetails;
  }
  
  const booking = state?.booking;
  // const apiResponse = state?.api_response;
  const departureFlightDetails = state?.departureFlightDetails;

  console.log("RETURN FLIGHT Booking:", JSON.stringify(booking, null, 2));
  console.log("RETURN FLIGHT Flight Details:", JSON.stringify(departureFlightDetails, null, 2));

  const apiResponse = return_api_response;

  // console.log("Return Flight Search Booking:", JSON.stringify(booking, null, 2));
  // console.log("Return Flight Search API Response:", JSON.stringify(apiResponse, null, 2));

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
        <p>Possible issues: Departure flight selected is unavailable.</p>
      </div>
    )
  } else if (!apiResponse.hasOwnProperty("best_flights") || apiResponse["best_flights"].length === 0) {
    return (
      <div>
        <h2>No Flights Found</h2>
        <p>Sorry, we couldn't find any flights matching your criteria.</p>
      </div>
    )
  } else if (departureFlightDetails === undefined || departureFlightDetails === null) {
    return (
      <div>
        <h2>Error: No Departure Flight Selected</h2>
        <p>Please select a departure flight before proceeding.</p>
      </div>
    )
  }

  return (
    <>
    <h1>
        Return Flight Selection
      </h1>

      <h3>
        This is your current departure flight information:
      </h3>
      <table>
            <thead>
                <tr>
                    <th>Flight Number: </th>
                    <th>Departure: </th>
                    <th>Arrival: </th>
                    <th>Price: </th>
                    <th>Layovers: </th>
                    <th>Airline: </th>
                </tr>
            </thead>
        <tbody>
            <tr>
                <td>{departureFlightDetails["flight_number"]}</td>
                <td><strong>{departureFlightDetails["departure_airport"]}</strong> <br/> {departureFlightDetails["departure_time"]}</td>
                <td><strong>{departureFlightDetails["arrival_airport"]}</strong> <br/> {departureFlightDetails["arrival_time"]}</td>
                <td>{departureFlightDetails["price"]} USD</td>
                <td>{departureFlightDetails["layovers"]}</td>
                <td>{departureFlightDetails["airline"]}</td>
            </tr>
        </tbody>
      </table>

      <h3>
        Select your preferred return flight from the options below:
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
                  {/* function has to take in the departure token onClick={() => bookFlight(flight["departure_token"])}*/}
                  <td><button>Book</button></td>
                </tr>)
               })}
            </tbody>
        </table>
      </div>
    </>
  )
}

export default ReturnFlightSelection
