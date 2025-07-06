import React, { useState } from 'react'
import { Session } from "@supabase/supabase-js";
import { useLocation, useNavigate} from 'react-router-dom';
import { Booking } from './Flight';
import { FlightDetails } from './OutboundFlightSelection';

// For testing purposes
// import { return_api_response } from './apiresponse';
import "./ReturnFlightSelection.css";
import api from '../../api';

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
  
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | undefined>();

  const booking = state?.booking;
  const apiResponse = state?.api_response;
  const departureFlightDetails = state?.departureFlightDetails;

  // console.log("RETURN FLIGHT Booking:", JSON.stringify(booking, null, 2));
  console.log("Return Flight Search API Response:", JSON.stringify(apiResponse, null, 2));
  // console.log("RETURN FLIGHT Flight Details:", JSON.stringify(departureFlightDetails, null, 2));

  // const apiResponse = return_api_response;

  if (apiResponse === undefined || apiResponse === null || booking === undefined || departureFlightDetails === undefined) {
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

  // Some API responses might not have "best_flights" but have "other_flights"
  const flightsToDisplay = apiResponse["best_flights"] || apiResponse["other_flights"];

  const searchNewFlight = async(booking : Booking) => {
    // need to send to backend to POST to flight search endpoint
    console.log("Return flight selection:", JSON.stringify(booking, null, 2));

    const response = await api.post("/flightsearch", booking);

    // console.log("Flight confirmation response:", JSON.stringify(response.data, null, 2));

    if (response.data.hasOwnProperty("error")) {
        throw new Error(response.data["error"]);
    }
    return response.data;
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const bookFlight = async(bookingToken: string) => {
    setMessage("Please wait while we summarise the flight details...");

    const updatedBooking: Booking = {
      ...booking,
      booking_token: bookingToken
    }

    // console.log("Updated Booking for Return Flight Search:", JSON.stringify(updatedBooking, null, 2));

    try {
      const FlightSummaryApiResponse = await searchNewFlight(updatedBooking);
      // const FlightSummaryApiResponse = "This is a test response from ReturnFlightSelection";

      console.log("Flight Summary API Response:", JSON.stringify(FlightSummaryApiResponse, null, 2));

      setMessage("Return flight selected! Summarising booking details...");

      await sleep(2000).then(() => {
        navigate("/flight-confirmation", {
          state: {
            booking: updatedBooking,
            api_response: FlightSummaryApiResponse,
          }
        });
      });
    } catch (error) {
      console.error("Error searching for new flight:", error);
      setMessage("Error retrieving flight information.");
    }
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
               {flightsToDisplay.map((flight: any, index: number) => {
                return (<tr key={index}>
                  <td>{flight["flights"][0]["flight_number"]}</td>
                  <td><strong>{flight["flights"][0]["departure_airport"]["name"]}</strong> <br/> {flight["flights"][0]["departure_airport"]["time"]}</td>
                  <td><strong>{flight["flights"][flight["flights"].length - 1]["arrival_airport"]["name"]}</strong> <br/> {flight["flights"][flight["flights"].length - 1]["arrival_airport"]["time"]}</td>
                  <td>{flight.price} USD </td>
                  <td>{flight["flights"].length}</td>
                  <td>{flight["flights"][0]["airline"]}</td>
                  {/* function has to take in the booking token onClick={() => bookFlight(flight["booking_token"])}*/}
                  <td><button onClick={() => bookFlight(flight["booking_token"])}>Book</button></td>
                </tr>)
               })}
            </tbody>
        </table>
      </div>
      <div>{message}</div>
    </>
  )
}

export default ReturnFlightSelection
