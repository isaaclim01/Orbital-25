import { useState, useEffect } from 'react';
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../App";
import { Hotel } from "../../types";
import "./bookings.css";

interface BookingsProps {
    user: Session['user'];
}

interface Booking {
    id: number;
    hotel: number;
    dateFrom: string;
    dateTo: string;
    price: number;
    // Add other booking fields as needed
}

export default function Bookings({ user }: BookingsProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [hotels, setHotels] = useState<Record<number, Hotel>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getUsername = () => {
        const atIndex = user.email?.indexOf('@');
        return user.email?.slice(0, atIndex);
    }

    // Fetch all needed data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch bookings
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from('Bookings')
                    .select('*')
                    .order('dateFrom', { ascending: false })
                    .eq("user", user.id)
                    .limit(10);

                if (bookingsError) throw bookingsError;
                
                // 2. Get unique hotel IDs from bookings
                const hotelIds = Array.from(new Set(bookingsData?.map(b => b.hotel) || []));
                
                // 3. Fetch all relevant hotels in one query
                const { data: hotelsData, error: hotelsError } = await supabase
                    .from('Hotels')
                    .select('*')
                    .in('id', hotelIds);

                if (hotelsError) throw hotelsError;
                
                // 4. Create a map of hotels by ID for quick lookup
                const hotelsMap = hotelsData?.reduce((acc, hotel) => {
                    acc[hotel.id] = hotel;
                    return acc;
                }, {} as Record<number, Hotel>);

                setBookings(bookingsData || []);
                setHotels(hotelsMap || {});
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <br />
            <h1 id="title">
                <strong>{getUsername()}</strong>'s bookings
            </h1>

            <main>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Hotel</th>
                            <th>Address</th>
                            <th>Check-in Date</th>
                            <th>Check-out Date</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => {
                            const hotel = hotels[booking.hotel];
                            return (
                                <tr key={booking.id}>
                                    <td>{index + 1}</td>
                                    <td>{hotel?.name || 'Unknown Hotel'}</td>
                                    <td>{hotel?.address || 'N/A'}</td>
                                    <td>{new Date(booking.dateFrom).toLocaleDateString()}</td>
                                    <td>{new Date(booking.dateTo).toLocaleDateString()}</td>
                                    <td>${booking.price.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </main>
        </div>
    );
}