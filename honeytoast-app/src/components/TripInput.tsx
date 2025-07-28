import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "../App";
import { Session } from "@supabase/supabase-js";
import { useSearch } from "../context/SearchContext";
import { TextField, Button, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { DateRangeInput } from "@cameratajs/react-date-range-input";
import { DateRange } from "../types";
import { format } from "date-fns";

interface TripInputProps {
    user: Session['user'];
    fetchTrips?: () => void;
}

function TripInput({ user, fetchTrips }: TripInputProps) {

    const {
        searchState,
        updateDestination,
        updateDates,
        updateOptions,
        resetSearch
    } = useSearch(); // Use the search context

    const handleDateChange = (newDate: DateRange) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validate dates
        let startDate = newDate.startDate;
        let endDate = newDate.endDate;

        if (startDate && startDate < today) {
            startDate = null;
        }

        if (endDate && endDate < today) {
            endDate = null;
        }

        updateDates({
            startDate,
            endDate
        });
    };

    const addNewTrip = async (start: string, destination: string,
        startDate: string | null, endDate: string | null, pax: number
    ) => {
        const { error } = await supabase
            .from('Trips')
            .insert([
                {
                    start: start, destination: destination, start_date: startDate,
                    end_date: endDate, pax: pax, user_id: user.id
                },
            ])
            .select()
        if (error !== null) {
            console.error("Error adding new trip: ", error.message);
        }
    }

    const [start, setStart] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (start.length === 0 || searchState.destination.length === 0) {
            setMessage("Please fill in all fields");
            return;
        }

        if (searchState.options.adult <= 0) {
            setMessage("You can't have a trip without people!");
            return;
        }

        if (!searchState.dates.startDate || !searchState.dates.endDate) {
            setMessage("Please enter dates");
            return;
        }

        try {
            const startDateStr = searchState.dates.startDate
                ? format(searchState.dates.startDate, 'yyyy-MM-dd')
                : null;

            const endDateStr = searchState.dates.endDate
                ? format(searchState.dates.endDate, 'yyyy-MM-dd')
                : null;

            await addNewTrip(start, searchState.destination, startDateStr, endDateStr, searchState.options.adult);
            setMessage("Trip added successfully!");
            fetchTrips && fetchTrips();
        } catch (error) {
            setMessage("Failed to add trip");
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '2rem auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>Add your trips here!</Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                    {/* From */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="From"
                            fullWidth
                            value={start}
                            sx={{
                                backgroundColor: "white"
                            }}
                            onChange={(e) => setStart(e.target.value)}
                        />
                    </Grid>

                    {/* To */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            label="To"
                            fullWidth
                            value={searchState.destination}
                            sx={{
                                backgroundColor: "white"
                            }}
                            onChange={(e) => updateDestination(e.target.value)}
                        />
                    </Grid>

                    {/* Date Range */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Box sx={{
                            '& .date-range-picker': {
                                width: '100%',
                                '& input': { padding: '10px 14px' }
                            }
                        }}>
                            <DateRangeInput
                                startDate={searchState.dates.startDate}
                                endDate={searchState.dates.endDate}
                                onChange={handleDateChange}
                            />
                        </Box>
                    </Grid>

                    {/* Travellers */}
                    <Grid size={{ xs: 12, md: 1 }}>
                        <TextField
                            type="number"
                            fullWidth
                            label="Travellers"
                            sx={{
                                backgroundColor: "white"
                            }}
                            value={searchState.options.adult}
                            onChange={(e) => updateOptions({ adult: parseInt(e.target.value) })}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12, md: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                height: '56px',
                                backgroundColor: "orange"
                            }} // Match TextField height
                        >
                            Add Trip
                        </Button>
                    </Grid>
                </Grid>

                {/* Message */}
                {message && (
                    <Typography color={message.includes('success') ? 'green' : 'red'} mt={2}>
                        {message}
                    </Typography>
                )}
            </form>
        </Box>
    );
}

export default TripInput;