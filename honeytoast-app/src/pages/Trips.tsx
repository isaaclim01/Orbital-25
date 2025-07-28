import { Session } from "@supabase/supabase-js";
import TripInput from "../components/TripInput";
import "./Trips.css"
import { useEffect, useState } from "react";
import { supabase } from "../App";
import { Trip } from "../types";

interface TripsProps {
  user: Session['user'];
}

function Trips({ user }: TripsProps) {

  const [trips, setTrips] = useState<Trip[]>([]);

  const getUsername = () => {
    const atIndex = user.email?.indexOf('@');
    return user.email?.slice(0, atIndex);
  }

  const fetchTrips = async () => {
    let { data, error } = await supabase
      .from("Trips")
      .select("*")
      .order("start_date", {
        ascending: false,
      })
      .eq("user_id", user.id)
      .limit(10);
    if (data !== null) {
      setTrips(data as Trip[]);
    }
    if (error !== null) {
      console.error("Error fetching tasks: ", error.message);
    }
  };

  useEffect(() => {fetchTrips();}, []);


  return (
    <div>
      <br></br>
      <h1 id="title">
        <strong>{getUsername()}</strong>'s trips
      </h1>

      <main>
        <TripInput
          user={user}
          fetchTrips={fetchTrips} />
          <br></br>
        <table>
            <thead>
                <tr>
                    <th>No. </th>
                    <th>From </th>
                    <th>To </th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>No. of travellers</th>
                </tr>
            </thead>
            <tbody>
                {trips.map((trip, index) => {
                    return (<tr>
                        <td>{index + 1}</td>
                        <td>{trip.start}</td>
                        <td>{trip.destination}</td>
                        <td>{trip.start_date}</td>
                        <td>{trip.end_date}</td>
                        <td>{trip.pax}</td>
                    </tr>)
                })}
            </tbody>
        </table>
      </main>
    </div>
  )
}

export default Trips;
