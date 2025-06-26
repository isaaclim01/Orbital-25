import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import api from "../api";
import { supabase } from "../App";
import { Session } from "@supabase/supabase-js";
import "./Flight.css"

interface Booking {
  search_parameters: {
    engine: "google_flights";
    hl: "en";
    gl: "us";
    type: string;
    departure_id: string;
    arrival_id: string;
    outbound_date: string;
    return_date: string;
    adults: number;
    stops: number;
    currency: string;
    sort_by: string;
    max_price: number;
  };
}

interface FlightProps {
  user: Session['user'];
}

function Flight({ user }: FlightProps) {
  const searchNewFlight = async(booking: Booking) => {
    // need to send to backend to POST to flight search endpoint
    return 0;
  }

  const [type, setType] = useState("1");  // default set to round trip
  const [departure_id, setDepartureId] = useState("");
  const [arrival_id, setArrivalId] = useState("");
  
  const [outbound_date, setOutboundDate] = useState(new Date().toISOString().split('T')[0]); // default is today
  const [return_date, setReturnDate] = useState(new Date().toISOString().split('T')[0]);

  const [adults, setAdults] = useState(1);
  const [stops, setStops] = useState(0); // default is 0: any number of stops
  const [currency, setCurrency] = useState("USD");
  const [sort_by, setSortBy] = useState("1"); // default is Top Flights
  const [max_price, setMaxPrice] = useState(100000000); // default is unlimited

  const onInputChangeType = (e: ChangeEvent<HTMLInputElement>) => {
      setType(e.target.value);
  }
  const onInputChangeDepartureId = (e: ChangeEvent<HTMLInputElement>) => {
      setDepartureId(e.target.value);
  }
   const onInputChangeArrivalId = (e: ChangeEvent<HTMLInputElement>) => {
      setArrivalId(e.target.value);
  }
   const onInputChangeOutboundDate = (e: ChangeEvent<HTMLInputElement>) => {
      setOutboundDate(e.target.value);
  }
   const onInputChangeReturnDate = (e: ChangeEvent<HTMLInputElement>) => {
      setReturnDate(e.target.value);
  }
   const onInputChangeAdults = (e: ChangeEvent<HTMLInputElement>) => {
      setAdults(e.target.valueAsNumber);
  }
   const onInputChangeStops = (e: ChangeEvent<HTMLInputElement>) => {
      setStops(e.target.valueAsNumber);
  }
  const onInputChangeCurrency = (e: ChangeEvent<HTMLInputElement>) => {
      setCurrency(e.target.value);
  }
  const onInputChangeSortBy = (e: ChangeEvent<HTMLInputElement>) => {
      setSortBy(e.target.value);
  }
  const onInputChangeMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
      setMaxPrice(e.target.valueAsNumber);
  }
  
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (departure_id.length === 0 || arrival_id.length === 0 || 
    type.length === 0 || currency.length === 0 ||
    sort_by.length === 0) {
        setMessage("Please fill in all fields");
        return;
    }

    const now = new Date();
    const outbound = new Date(outbound_date);
    const ret = new Date(return_date);

    if (now > outbound && now > ret) {
        setMessage("Outbound and Return dates must be in the future");
        return;
    }

    if (ret < outbound) {
        setMessage("Return date must be after Outbound date");
        return;
    }

    if (adults <= 0) {
        setMessage("Must have at least one traveller");
        return;
    }

    if (max_price <= 0) {
      setMessage("Max Price cannot be $0 or less")
      return;
    }

    try {
        
        // await searchNewFlight(start, destination, new Date(startDate), new Date(endDate), pax);
        setMessage("Outbound flight found!");

        // Should redirect to a page to select the return flight
        // After picking return flight, should redirect to booking
        // AND add the trip to the Trip.tsx database
    } catch (error) {
        setMessage("Unable to find trip");
    }
  }

  return (
     <>
        <h1>Flight Search</h1>

            <form id="flight-search" onSubmit={handleSubmit}>
              <label htmlFor="type">Trip Type:  </label>
                <input
                    type="text"
                    value={type}
                    required
                    id="type"
                    name="Trip Type: "
                    onChange={onInputChangeType} />

              <br />
                <label htmlFor="departure">From Airport (Only IATA codes):  </label>
                <input
                    type="text"
                    value={departure_id}
                    required
                    id="departure"
                    name="From: "
                    onChange={onInputChangeDepartureId} />
              <br />
                <label htmlFor="arrival">To Airport (Only IATA codes):  </label>
                <input
                    type="text"
                    value={arrival_id}
                    required
                    id="arrival"
                    name="To: "
                    onChange={onInputChangeArrivalId} />
              <br />
                <label htmlFor="outbound_date">Outbound Date:  </label>
                <input
                    type="date"
                    value={outbound_date}
                    required
                    id="outbound_date"
                    name="Outbound Date: "
                    onChange={onInputChangeOutboundDate} />
              <br />
                <label htmlFor="return_date">Return Date:  </label>
                <input
                    type="date"
                    value={return_date}
                    required
                    id="return_date"
                    name="Return Date: "
                    onChange={onInputChangeReturnDate} />
              <br />
                <label htmlFor="adults">No. of Adults:  </label>
                <input
                    type="number"
                    value={adults}
                    required
                    id="adults"
                    name="No. of adults: "
                    onChange={onInputChangeAdults} />
              <br />
                <label htmlFor="stops">No. of Stops:  </label>
                <input
                    type="number"
                    value={stops}
                    required
                    id="stops"
                    name="No. of stops: "
                    onChange={onInputChangeStops} />
              <br />
                <label htmlFor="currency">Currency Abbrev.:  </label>
                <input
                    type="text"
                    value={currency}
                    required
                    id="currency"
                    name="Currency: "
                    onChange={onInputChangeCurrency} />
              <br />
                <label htmlFor="sort_by">Sort By:  </label>
                <input
                    type="text"
                    value={sort_by}
                    required
                    id="sort_by"
                    name="Sort By: "
                    onChange={onInputChangeSortBy} />
              <br />
                <label htmlFor="max_price">Max Price:  </label>
                <input
                    type="number"
                    value={max_price}
                    required
                    id="max_price"
                    name="Max Price: "
                    onChange={onInputChangeMaxPrice} />
              <br />
                <button type="submit">Search Flight</button>
            </form>
            <div>
                {message}
            </div>
        </>
  )
}

export default Flight;
