import { FaMapLocationDot, FaPeopleGroup } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { ChangeEvent, useState } from 'react';
import { DateRangeInput } from '@cameratajs/react-date-range-input';
import './AccomHome.css';
import { Button, TextField, Box, Typography, Autocomplete } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { DateRange, People } from "../../types";
import { useSearch } from "../../context/SearchContext";
import { validCities, isValidCity } from "../../components/ValidCity";

function AccomHome() {
    const navigate = useNavigate();
    const {
        searchState,
        updateDestination,
        updateDates,
        updateOptions,
        resetSearch
    } = useSearch(); // Use the search context

    const theme = createTheme({
        palette: {
            primary: {
                main: '#E1AD01'
            }
        }
    });

    const [openPeople, setOpenPeople] = useState<boolean>(false);

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

    const handleOption = (type: keyof People, op: "inc" | "dec") => {
        const currentValue = searchState.options[type];
        const newValue = op === "inc" ? currentValue + 1 : currentValue - 1;

        updateOptions({
            [type]: newValue
        });
    };

    const handleClick = () => {
        if (!searchState.dates.startDate || !searchState.dates.endDate) {
            alert("Please select both start and end dates");
            return;
        }

        navigate('/hotels', {
            state: {
                destination: searchState.destination,
                dates: searchState.dates,
                options: searchState.options
            }
        });
    };

    return (
        <div className="searchBarContainer">
            <Typography variant="h4" className="heading"  sx={{color: "darkorange"}} gutterBottom>Accommodation Search</Typography>
            <div className="searchBar">
                <div className="searchBarItemFirst">
                    <FaMapLocationDot size={42} />
                    <span> </span>
                    <Autocomplete
                        options={validCities}
                        fullWidth
                        value={searchState.destination}
                        renderInput={(params) => <TextField {...params} label="Destination"/>}
                        onChange={(e, newValue: string | null) => {
                            newValue && updateDestination(newValue);
                        }}
                    />
                </div>
                <div className="searchBarItem">
                    <CiCalendarDate size={70} />
                    <DateRangeInput
                        startDate={searchState.dates.startDate}
                        endDate={searchState.dates.endDate}
                        onChange={handleDateChange}
                        calendars={2}
                        anchor="bottom"
                        color="#000000"
                        highlightColor="#F97e54"
                        highlightRangeColor="#f9d054"
                        startDatePlaceholder="Check-in date"
                        endDatePlaceholder="Check-out date"
                    />
                </div>
                <div className="searchBarItem peopleSelector">
                    <FaPeopleGroup size={70} />
                    <Box
                        onClick={() => setOpenPeople(!openPeople)}
                        sx={{
                            outline: 1,
                            outlineColor: openPeople ? "#F97e54" : "rgba(0, 0, 0, 0.23)",
                            borderRadius: 1,
                            width: '100%',
                            height: 25,
                            padding: 2,
                            fontSize: 18,
                            cursor: 'pointer',
                            transition: 'outline-color 0.2s ease',
                            '&:hover': {
                                outlineColor: "#F97e54"
                            }
                        }}
                    >
                        {`${searchState.options.adult} Adult${searchState.options.adult !== 1 ? 's' : ''} • ${searchState.options.children} Child${searchState.options.children !== 1 ? 'ren' : ''} • ${searchState.options.room} Room${searchState.options.room !== 1 ? 's' : ''}`}
                    </Box>
                    {openPeople && (
                        <>
                            <div className="optionsBackdrop" onClick={() => setOpenPeople(false)} />
                            <Box className="options">
                                <div className="optionItem">
                                    <span>Adult</span>
                                    <div className="optionCounter">
                                        <Button
                                            disabled={searchState.options.adult <= 1}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "dec")}>-</Button>
                                        <span>{searchState.options.adult}</span>
                                        <Button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "inc")}>+</Button>
                                    </div>
                                </div>
                                <div className="optionItem">
                                    <span>Children</span>
                                    <div className="optionCounter">
                                        <Button
                                            disabled={searchState.options.children <= 0}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("children", "dec")}>-</Button>
                                        <span>{searchState.options.children}</span>
                                        <Button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("children", "inc")}>+</Button>
                                    </div>
                                </div>
                                <div className="optionItem">
                                    <span>Rooms</span>
                                    <div className="optionCounter">
                                        <Button
                                            disabled={searchState.options.room <= 1}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("room", "dec")}>-</Button>
                                        <span>{searchState.options.room}</span>
                                        <Button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("room", "inc")}>+</Button>
                                    </div>
                                </div>
                            </Box>
                        </>
                    )}
                </div>
                <ThemeProvider theme={theme}>
                    <Button
                        variant="contained"
                        onClick={handleClick}
                        disabled={!searchState.dates.startDate || !searchState.dates.endDate || !searchState.destination}
                    >
                        Search
                    </Button>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default AccomHome;