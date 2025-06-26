import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import api from "../api";
import { supabase } from "../App";
import { Session } from "@supabase/supabase-js";

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
  const searchNewFlight = async(booking: Booking){
    // need to send to backend to POST to flight search endpoint
    return 0
  }

  const [type, setType] = useState("1");  // default set to round trip
  const [departure_id, setDepartureId] = useState("");
  const [arrival_id, setArrivalId] = useState("");
  
  const [outbound_date, setOutboundDate] = useState("2025-01-01");
  const [return_date, setReturnDate] = useState("2025-01-01");

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
        // // Clear form
        // setStart("");
        // setDestination("");
        // setStartDate("2020-01-01");
        // setEndDate("2020-01-01");
        // setPax(1);
    } catch (error) {
        setMessage("Unable to find trip");
    }
  }

  return (
     <>
        <h1>Flight Search</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={type}
                    required
                    id="type"
                    name="Trip Type: "
                    onChange={onInputChangeType} />
                <input
                    type="text"
                    value={departure_id}
                    required
                    id="departure"
                    name="From: "
                    onChange={onInputChangeDepartureId} />
                <input
                    type="text"
                    value={arrival_id}
                    required
                    id="arrival"
                    name="To: "
                    onChange={onInputChangeArrivalId} />
                <input
                    type="date"
                    value={outbound_date}
                    required
                    id="outbound_date"
                    name="Outbound Date: "
                    onChange={onInputChangeOutboundDate} />
                <input
                    type="date"
                    value={return_date}
                    required
                    id="return_date"
                    name="Return Date: "
                    onChange={onInputChangeReturnDate} />
                <input
                    type="number"
                    value={adults}
                    required
                    id="adults"
                    name="No. of adults: "
                    onChange={onInputChangeAdults} />
                <input
                    type="number"
                    value={stops}
                    required
                    id="stops"
                    name="No. of stops: "
                    onChange={onInputChangeStops} />
                <input
                    type="text"
                    value={currency}
                    required
                    id="currency"
                    name="Currency: "
                    onChange={onInputChangeCurrency} />
                <input
                    type="text"
                    value={sort_by}
                    required
                    id="sort_by"
                    name="Sort By: "
                    onChange={onInputChangeSortBy} />
                <input
                    type="number"
                    value={max_price}
                    required
                    id="max_price"
                    name="Max Price: "
                    onChange={onInputChangeMaxPrice} />
                <button type="submit">Search Flight</button>
            </form>
            <div>
                {message}
            </div>
        </>
  )
}

export default Flight;
