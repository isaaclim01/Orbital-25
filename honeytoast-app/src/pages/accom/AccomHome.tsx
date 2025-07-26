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

    const handleClick = () => {
        console.log("button clicked")
    };


    return (
        <div className="searchBarContainer">
            <div className="searchBar">
                <div className="searchBarItem">
                    <FaMapLocationDot size={42} />
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
                <div className="searchBarItem">
                    <FaPeopleGroup size={42} />
                    <Box onClick={() => setOpenPeople(!openPeople)}
                        sx = {{outline: 1,
                            borderRadius: 1,
                            width: 700,
                            height: 25,
                            padding: 2,
                            fontSize: 18,
                            '&:hover': {
                                outlineColor: "#F97e54"                          }
                        }}>
                        {`${people.adult} adult | ${people.children} children | ${people.rooms} room`}
                    </Box>
                    {openPeople && (
                        <Box className="options">
                            <div className="optionItem">
                                <span>Adult</span>
                                <div className="optionCounter">
                                    <Button>-</Button>
                                    <span>{people.adult}</span>
                                    <Button>+</Button>
                                </div>
                            </div>
                        </Box>
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