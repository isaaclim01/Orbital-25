import { FaMapLocationDot } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaPeopleGroup } from "react-icons/fa6";
import { ChangeEvent, useState } from 'react';
import { DateRangeInput } from '@cameratajs/react-date-range-input';
import './AccomHome.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from "@mui/material";



interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface People {
    [key: string]: number;
    adult: number;
    children: number;
    rooms: number;
}

function AccomHome() {

    const theme = createTheme({
        palette: {
            primary: {
                main: '#E1AD01'
            }
        }
    });

    const [date, setDate] = useState<DateRange>({
        startDate: null,
        endDate: null,
    });

    const [destination, setDestination] = useState<String>("");
    const [openPeople, setOpenPeople] = useState<boolean>(false);
    const [people, setPeople] = useState<People>({
        adult: 1,
        children: 0,
        rooms: 1
    });


    const handleDateChange = (newDate: DateRange) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison

        // Validate start date
        let startDate = newDate.startDate;
        if (startDate && startDate < today) {
            startDate = null; // Reset to today if earlier date is selected
        }

        // Validate end date
        let endDate = newDate.endDate;
        if (endDate) {
            // Ensure end date isn't before today or before start date
            if (endDate < today) {
                endDate = null;
            }
        }

        setDate({
            startDate: startDate,
            endDate: endDate
        })

    };

    const handleOption = (type: string, op: string) => {
        setPeople((prev) => {
            return {
                ...prev,
                [type]: op === "inc" ? prev[type] + 1 : prev[type] - 1
            };
        });
    };
    const handleClick = () => {
        console.log("button clicked")
    };


    return (
        <div className="searchBarContainer">
            <div className="searchBar">
                <div className="searchBarItemFirst">
                    <FaMapLocationDot size={42} />
                    <span> </span>
                    <TextField
                        label="Destination"
                        fullWidth
                        value={destination}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setDestination(event.target.value);
                        }}
                    />
                </div>
                <div className="searchBarItem">
                    <CiCalendarDate size={70} />
                    <DateRangeInput
                        startDate={date.startDate}
                        endDate={date.endDate}
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
                        {`${people.adult} adult${people.adult !== 1 ? 's' : ''} • ${people.children} child${people.children !== 1 ? 'ren' : ''} • ${people.rooms} room${people.rooms !== 1 ? 's' : ''}`}
                    </Box>
                    {openPeople && (
                        <>
                            <div className="optionsBackdrop" onClick={() => setOpenPeople(false)} />
                            <Box className="options">
                                <div className="optionItem">
                                    <span>Adult</span>
                                    <div className="optionCounter">
                                        <Button
                                            disabled={people.adult <= 1}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "dec")}>-</Button>
                                        <span>{people.adult}</span>
                                        <Button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("adult", "inc")}>+</Button>
                                    </div>
                                </div>
                                <div className="optionItem">
                                    <span>Children</span>
                                    <div className="optionCounter">
                                        <Button
                                            disabled={people.children <= 0}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("children", "dec")}>-</Button>
                                        <span>{people.children}</span>
                                        <Button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("children", "inc")}>+</Button>
                                    </div>
                                </div>
                                <div className="optionItem">
                                    <span>Rooms</span>
                                    <div className="optionCounter">
                                        <Button
                                            disabled={people.rooms <= 1}
                                            className="optionCounterButton"
                                            onClick={() => handleOption("rooms", "dec")}>-</Button>
                                        <span>{people.rooms}</span>
                                        <Button
                                            className="optionCounterButton"
                                            onClick={() => handleOption("rooms", "inc")}>+</Button>
                                    </div>
                                </div>
                            </Box>
                        </>
                    )}
                </div>
                <ThemeProvider theme={theme}>
                    <Button
                        variant="contained"
                        onClick={handleClick}>
                        Search
                    </Button>
                </ThemeProvider>
            </div>
        </div>
    )
}

export default AccomHome;