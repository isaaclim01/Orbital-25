import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import { DateRange } from "../../types";
import axios from "axios";
import { FaCircleXmark } from "react-icons/fa6";
import { Session } from "@supabase/supabase-js";
import { useSearch } from "../../context/SearchContext";

interface RoomType {
    id: number;
    price: number;
    pax: number;
    desc: string;
    type: string;
    room_number: number;
    unavailable_dates: string[];
}

const Reserve = ({ hotelId, setOpen, user }: { hotelId: number; setOpen: (value: boolean) => void; user: Session['user'] }) => {
    const { data: rooms, loading, error } = useFetch<RoomType[]>(`/rooms/hotel/${hotelId}`);
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isBooking, setIsBooking] = useState(false);
    const {
        searchState,
        updateDestination,
        updateDates,
        updateOptions,
        resetSearch
    } = useSearch();

    const handleSelectRoom = (roomId: number, isSelected: boolean, price: number) => {
        if (isSelected) {
            setSelectedRooms(prev => [...prev, roomId]);
            setTotalPrice(prev => prev + price);
        } else {
            setSelectedRooms(prev => prev.filter(id => id !== roomId));
            setTotalPrice(prev => prev - price);
        }
    };

    const isRoomAvailable = (room: RoomType, dateRange: string[] | null) => {
        if (!dateRange) return false;

        return !dateRange.some(dateStr =>
            room.unavailable_dates.includes(dateStr)
        );
    };

    // Also update your getDateRange function to handle dates consistently:
    const getDateRange = (startDate: Date | null, endDate: Date | null) => {
        if (!startDate || !endDate) return null;

        const dates: string[] = []; // Now returns string[] instead of number[]
        const current = new Date(startDate);
        const end = new Date(endDate);

        // Normalize to avoid timezone issues
        current.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        while (current <= end) {
            // Format as YYYY-MM-DD
            const dateStr = current.toISOString().split('T')[0];
            dates.push(dateStr);
            current.setDate(current.getDate() + 1);
        }

        return dates;
    };

    const dateRange = getDateRange(searchState.dates.startDate, searchState.dates.endDate);

    const handleBooking = async () => {
        if (!user) {
            alert('Please login to book rooms');
            return;
        }

        if (!dateRange || selectedRooms.length === 0 || !searchState.dates.startDate || !searchState.dates.endDate) {
            alert('Please select dates and rooms');
            return;
        }

        setIsBooking(true);
        try {
            await axios.put(`http://localhost:8800/api/rooms/availability/${selectedRooms.join(',')}`, {
                datesToAdd: dateRange
            });

            // Create booking record
            await axios.post('http://localhost:8800/api/bookings', {
                user: user.id,
                hotel: hotelId,
                rooms: selectedRooms,
                dateFrom: searchState.dates.startDate?.toISOString(),
                dateTo: searchState.dates.endDate?.toISOString(),
                price: totalPrice,
            });

            alert('Booking successful!');
            setOpen(false);
        } catch (err) {
            console.error('Booking failed:', err);
            alert('Booking failed. Please try again.');
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) return <div className="loading">Loading rooms...</div>;
    if (error) return <div className="error">Error loading rooms: {error.message}</div>;


    return (
        <div className="reserve">
            <Box className="reserveContainer">
                <FaCircleXmark
                    className="close"
                    onClick={() => setOpen(false)}
                />
                <Typography variant="h6" gutterBottom>Select your rooms:</Typography>
                <Divider sx={{ my: 2 }} />

                {rooms?.length ? (
                    rooms.map(room => {
                        const isAvailable = isRoomAvailable(room, dateRange);
                        return (
                            <Box key={room.id} className="roomItem" sx={{
                                mb: 3,
                                opacity: isAvailable ? 1 : 0.6
                            }}>
                                <Box display="flex" justifyContent="space-between">
                                    <div>
                                        <Typography variant="subtitle1">{room.type}</Typography>
                                        <Typography variant="body2">{room.desc}</Typography>
                                        <Typography variant="body2">
                                            Max people: {room.pax}
                                        </Typography>
                                    </div>
                                    <Typography variant="h6">${room.price}</Typography>
                                </Box>

                                {isAvailable ? (
                                    <Box mt={2}>
                                        <Typography variant="body2">Room Number: {room.room_number}</Typography>
                                        <Box mt={1}>
                                            <Chip
                                                label={`Room ${room.room_number}`}
                                                color={selectedRooms.includes(room.id) ? 'primary' : 'default'}
                                                onClick={() => handleSelectRoom(
                                                    room.id,
                                                    !selectedRooms.includes(room.id),
                                                    room.price
                                                )}
                                                variant={selectedRooms.includes(room.id) ? 'filled' : 'outlined'}
                                            />
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography color="error" mt={2}>
                                        Not available for selected dates
                                    </Typography>
                                )}
                            </Box>
                        );
                    })
                ) : (
                    <Typography>No rooms available</Typography>
                )}

                {selectedRooms.length > 0 && (
                    <Box mt={4} className="bookingSummary">
                        <Typography variant="h6" gutterBottom>
                            Booking Summary
                        </Typography>
                        <Typography>
                            Selected rooms: {selectedRooms.length}
                        </Typography>
                        <Typography>
                            Total price: ${totalPrice}
                        </Typography>
                        <Typography color="text.secondary">
                            {searchState.dates.startDate?.toLocaleDateString()} - {searchState.dates.endDate?.toLocaleDateString()}
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                            onClick={handleBooking}
                            disabled={isBooking}
                        >
                            {isBooking ? 'Booking...' : 'Reserve Now'}
                        </Button>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default Reserve;