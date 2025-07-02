import { useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";


interface OutboundFlightSelectionProps {
  user: Session['user'];
}

function OutboundFlightSelection({ user }: OutboundFlightSelectionProps) {
  const location = useLocation();
  const state = location.state as {
    api_response: any;
  }

  const apiResponse = state?.api_response;

  console.log("API Response:", JSON.stringify(apiResponse, null, 2));

  if (apiResponse === undefined || 
  apiResponse === null || 
  !apiResponse.hasOwnProperty("best_flight") || 
  apiResponse["best_flight"].length === 0) {
    return (
      <div>
        <h2>No Flights Found</h2>
        <p>Sorry, we couldn't find any flights matching your criteria.</p>
      </div>
    )
  }

  // Info needed: 1) Flight Name, Dates and Times, 2) Price, 3) Stops, 4) Airline

  return (
    <>
      <h1>
        Outbound Flight Selection
      </h1>

      <p>
        Select your preferred outbound flight from the options below:
      </p>

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
                </tr>
            </thead>
            <tbody>
               {apiResponse["best_flight"].map((flight: any, index: number) => {
                return (<tr>
                  <td>{flight["flights"][0]["flight_number"]}</td>
                  <td>{flight["flights"][0]["departure_airport"]} {flight["flights"][0]["departure_airport"]["time"]}</td>
                  <td>{flight["flights"][flight["flights"].length - 1]["arrival_airport"]} {flight["flights"][flight["flights"].length - 1]["arrival_airport"]["time"]}</td>
                  <td>{flight.price} USD </td>
                  <td>{flight["flights"].length}</td>
                  <td>{flight["flights"][0]["airline"]}</td>
                </tr>)
               })}
            </tbody>
        </table>
       
      </div>
    </>
  )
}

export default OutboundFlightSelection
