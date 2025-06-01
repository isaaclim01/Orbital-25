import { ChangeEvent, FormEvent, useState } from "react";

interface TripInputProps {
    handleAddNewTrip: (start: string, destination: string,
        startDate: Date, endDate: Date, pax: number
    ) => void;
}

function TripInput({ handleAddNewTrip }: TripInputProps) {
    const [start, setStart] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("2020-01-01");
    const [endDate, setEndDate] = useState("2020-01-01");
    const [pax, setPax] = useState(1);

    const onInputChangeStart = (e: ChangeEvent<HTMLInputElement>) => {
        setStart(e.target.value);
    };

    const onInputChangeEnd = (e: ChangeEvent<HTMLInputElement>) => {
        setDestination(e.target.value);
    };

    const onInputChangeStartDate = (e: ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const onInputChangeEndDate = (e: ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };

    const onInputChangePax = (e: ChangeEvent<HTMLInputElement>) => {
        setPax(e.target.valueAsNumber);
    };

    const [message, setMessage] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (start.length === 0 || destination.length === 0 || pax === 0) {
            setMessage("Please fill in all fields");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setMessage("End date must be after start date");
            return;
        }

        try {
            await handleAddNewTrip(start, destination, new Date(startDate), new Date(endDate), pax);
            setMessage("Trip added successfully!");
            // Clear form
            setStart("");
            setDestination("");
            setStartDate("2020-01-01");
            setEndDate("2020-01-01");
            setPax(1);
        } catch (error) {
            setMessage("Failed to add trip");
        }
    };

    return (
        <>
            <h1>Add Trip</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={start}
                    required
                    id="start"
                    name="From: "
                    onChange={onInputChangeStart} />
                <input
                    type="text"
                    value={destination}
                    required
                    id="destination"
                    name="To: "
                    onChange={onInputChangeEnd} />
                <input
                    type="date"
                    value={startDate}
                    required
                    id="startDate"
                    name="Start Date: "
                    onChange={onInputChangeStartDate} />
                <input
                    type="date"
                    value={endDate}
                    required
                    id="endDate"
                    name="End Date: "
                    onChange={onInputChangeEndDate} />
                <input
                    type="number"
                    value={pax}
                    required
                    id="pax"
                    name="No. of travellers: "
                    onChange={onInputChangePax} />
                <input
                    type="submit"
                />
            </form>
            <div>
                {message}
            </div>
        </>
    )
}

export default TripInput;