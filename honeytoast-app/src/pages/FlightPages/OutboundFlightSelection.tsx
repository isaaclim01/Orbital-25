import { useLocation, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import {Booking} from "./Flight";
import "./OutboundFlightSelection.css";

// just for testing purposes
// import { api_response } from "./apiresponse";
import { useState } from "react";
import api from "../../api";
import { AsyncLocalStorage } from "node:async_hooks";

interface OutboundFlightSelectionProps {
  user: Session['user'];
}

export interface FlightDetails {
  flight_number: string;
  departure_airport: string,
  departure_time: string, 
  arrival_airport: string,
  arrival_time: string,
  price: number;
  layovers: number;
  airline: string;
}

function OutboundFlightSelection({ user }: OutboundFlightSelectionProps) {
  const [message, setMessage] = useState<string | undefined>(); 
  
  const location = useLocation();
  const state = location.state as {
    booking: Booking;
    api_response: any;
  }

  const apiResponse = state?.api_response;
  const booking : Booking  = state?.booking;
 
  console.log("API Response:", JSON.stringify(apiResponse, null, 2));

  // const booking : Booking = {
  //   "type": "1",
  //   "departure_id": "SIN",
  //   "arrival_id": "AUS",
  //   "outbound_date": "2025-09-09",
  //   "return_date": "2025-09-19",
  //   "adults": 1,
  //   "stops": 0,
  //   "currency": "USD",
  //   "sort_by": "1",
  //   "max_price": 10000000000
  // }

  // const apiResponse = api_response;
  const navigate = useNavigate();

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
  } else if (!apiResponse.hasOwnProperty("best_flights") && !apiResponse.hasOwnProperty("other_flights")) {
    return (
      <div>
        <h2>No Flights Found</h2>
        <p>Sorry, we couldn't find any flights matching your criteria.</p>
      </div>
    )
  }

  // Some API responses might not have "best_flights" but have "other_flights"
  const flightsToDisplay = apiResponse["best_flights"] || apiResponse["other_flights"];

  const searchNewFlight = async(booking : Booking, ) => {
    // need to send to backend to POST to flight search endpoint
    console.log("Booking for Return Flight Search:", JSON.stringify(booking, null, 2));

    const response = await api.post("/flightsearch", booking);

    console.log("Return Flight Search response:", JSON.stringify(response.data, null, 2));

    if (response.data.hasOwnProperty("error")) {
        throw new Error(response.data["error"]);
    }
    return response.data;
  }

  async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const bookFlight = async(departureToken: string, flightDetails: FlightDetails) => {
    setMessage("Please wait while we retrieve return flight information...");

    const updatedBooking: Booking = {
      ...booking,
      departure_token: departureToken
    }

    try {
      const newApiResponse = await searchNewFlight(updatedBooking);
      // const newApiResponse = "This is a test response";

      setMessage("Return flight found! Showing possible selections...");

      await sleep(2000).then(() => {
        navigate("/return-flight-selection", {
          state: {
            booking: booking,
            api_response: newApiResponse,
            departureFlightDetails: flightDetails
          }
        });
      });
    } catch (error) {
      console.error("Error searching for new flight:", error);
      setMessage("Error retrieving return flight information.");
    }
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
               {flightsToDisplay.map((flight: any, index: number) => {
                return (<tr key={index}>
                  <td>{flight["flights"][0]["flight_number"]}</td>
                  <td><strong>{flight["flights"][0]["departure_airport"]["name"]}</strong> <br/> {flight["flights"][0]["departure_airport"]["time"]}</td>
                  <td><strong>{flight["flights"][flight["flights"].length - 1]["arrival_airport"]["name"]}</strong> <br/> {flight["flights"][flight["flights"].length - 1]["arrival_airport"]["time"]}</td>
                  <td>{flight.price ? `${booking["currency"]} ${flight.price}` : <span>N/A</span>} </td>
                  <td>{flight["flights"].length}</td>
                  <td>{flight["flights"][0]["airline"]}</td>
                  {/* function has to take in the departure token */}
                  <td><button onClick={() => bookFlight(flight["departure_token"], {
                    flight_number: flight["flights"][0]["flight_number"],
                    departure_airport: flight["flights"][0]["departure_airport"]["name"],
                    departure_time: flight["flights"][0]["departure_airport"]["time"],
                    arrival_airport: flight["flights"][flight["flights"].length - 1]["arrival_airport"]["name"],
                    arrival_time: flight["flights"][flight["flights"].length - 1]["arrival_airport"]["time"],
                    price: flight.price,
                    layovers: flight["flights"].length,
                    airline: flight["flights"][0]["airline"]
                  })}>Book</button></td>
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
