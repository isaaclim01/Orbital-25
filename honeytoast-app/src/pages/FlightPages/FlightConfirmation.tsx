import React, {useState} from 'react'
import { Session } from "@supabase/supabase-js";
import { useLocation, useNavigate } from 'react-router-dom';
import "./FlightConfirmation.css";
import { Booking } from './Flight';

// for testing purposes
// import {flight_summary_response} from './apiresponse';
import api from '../../api';

interface FlightConfirmationProps {
    user: Session['user'];
}

function FlightConfirmation({ user }: FlightConfirmationProps) {
    const location = useLocation();
    const state = location.state as {
        booking: Booking;
        api_response: any;
    }

    const booking = state?.booking;
    const apiResponse = state?.api_response;
    const [message, setMessage] = useState("");
    // const apiResponse = flight_summary_response;

    // console.log("Flight Summary API Response:", JSON.stringify(apiResponse, null, 2));

    if (apiResponse === undefined || apiResponse === null || booking === undefined) {
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
  } else if (!apiResponse.hasOwnProperty("selected_flights") || apiResponse["selected_flights"].length === 0) {
    return (
      <div>
        <h2>No Flights Found</h2>
        <p>Sorry, we couldn't finalise your flight selection.</p>
      </div>
    )
  }

//   interface APIResponse {
//     status_code: number;
//     url?: string;
//   }

  const redirectToBookingPage = async () => {
    try {
        // API Response could either be together or separated into departing and arrival (so need to account for both)
        //  console.log("POST DATA:", JSON.stringify(apiResponse["booking_options"][0]["departing"], null, 2));

        const post_data = apiResponse["booking_options"][0]["together"].hasOwnProperty("booking_request") ?
                        apiResponse["booking_options"][0]["together"]["booking_request"]["post_data"] :
                        apiResponse["booking_options"][0]["departing"]["booking_request"]["post_data"]
        
        console.log("POST DATA:", JSON.stringify(post_data, null, 2));

        setMessage("Redirecting to external booking page...");
       
        const response = await api.post("/flightsearch/booking", {
            "post_data": post_data
        });
        
        console.log("RESPONSE:", JSON.stringify(response.data, null, 2));
        
        const { status_code, url } = response.data;
        if (status_code === 200 && url) {
            console.log("URL: " + url);
            const newTab = window.open("", "_blank");
            if (newTab) {
                newTab.document.open();
                newTab.document.write(url);
                newTab.document.close();
                setMessage("Redirect successful! Please complete your booking in the new tab.");
                alert("Successfully booked your next trip? Head over to the \"My Trips\" page to add your new trip!");
            } else {
                console.error("Popup blocked.");
                setMessage("Redirect failed! Please check your popup blocker settings.");
            }
        } else if (status_code !== 200 || !url) {
            console.error("Error booking flight:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error booking flight:", error);
        return;
    }
  }

  return (
    <>
        <h1>Flight Summary Page</h1>

        <h3>These are the departure and return flights you have selected.</h3>

        <table>
            <thead>
                <tr>
                    <th>Type: </th>
                    <th>Flight Number(s): </th>
                    <th>Departure: </th>
                    <th>Arrival: </th>
                    <th>Layovers: </th>
                    <th>Airline: </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Departure</td>
                    <td style={{ whiteSpace: "pre-line" }}>{apiResponse["selected_flights"][0]["flights"].map((details: any, index: any) => details["flight_number"]).join(", \n")}</td>
                    <td><strong>{apiResponse["selected_flights"][0]["flights"][0]["departure_airport"]["name"]}</strong> <br/>{apiResponse["selected_flights"][0]["flights"][0]["departure_airport"]["time"]}</td>
                    <td><strong>{apiResponse["selected_flights"][0]["flights"][apiResponse["selected_flights"][0]["flights"].length -  1]["arrival_airport"]["name"]}</strong> 
                        <br/>
                        {apiResponse["selected_flights"][0]["flights"][apiResponse["selected_flights"][0]["flights"].length -  1]["arrival_airport"]["time"]}</td>
                    <td><strong>{apiResponse["selected_flights"][0].hasOwnProperty("layovers") ? `${apiResponse["selected_flights"][0]["layovers"].length} stops` : "Non-stop"}</strong>
                        <br/>
                        {apiResponse["selected_flights"][0]["layovers"]?.map((layover: any, index: number) => (
                            <div key={index}>
                                {layover.name}<br/>
                            </div>
                        ))}
                    </td>
                    <td>{apiResponse["selected_flights"][0]["flights"][0]["airline"]}</td>
                </tr>
                <tr>
                    <td>Return</td>
                    <td style={{ whiteSpace: "pre-line" }}>{apiResponse["selected_flights"][1]["flights"].map((details: any, index: any) => details["flight_number"]).join(", \n")}</td>
                    <td><strong>{apiResponse["selected_flights"][1]["flights"][0]["departure_airport"]["name"]}</strong> <br/>{apiResponse["selected_flights"][1]["flights"][0]["departure_airport"]["time"]}</td>
                    <td><strong>{apiResponse["selected_flights"][1]["flights"][apiResponse["selected_flights"][1]["flights"].length -  1]["arrival_airport"]["name"]}</strong> 
                        <br/>
                        {apiResponse["selected_flights"][1]["flights"][apiResponse["selected_flights"][1]["flights"].length -  1]["arrival_airport"]["time"]}</td>
                    <td><strong>{apiResponse["selected_flights"][1].hasOwnProperty("layovers") ? `${apiResponse["selected_flights"][1]["layovers"].length} stops` : "Non-stop"}</strong>
                        <br/>
                        {apiResponse["selected_flights"][1]["layovers"]?.map((layover: any, index: number) => (
                            <div key={index}>
                                {layover.name}<br/>
                            </div>
                        ))}
                    </td>
                    <td>{apiResponse["selected_flights"][1]["flights"][0]["airline"]}</td>
                </tr>
            </tbody>
        </table>
        <br/>
        <h3>Total Price: <strong>{booking["currency"]} {apiResponse["price_insights"]?.lowest_price}</strong></h3>
        <button onClick={() => redirectToBookingPage()}>Book Now!!</button>
        <br/>
        <br/>
        <div>{message}</div>
    </>
  )
}

export default FlightConfirmation