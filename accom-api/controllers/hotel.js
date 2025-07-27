import supabase from "../index.js";

export const createHotel = async (req, res, next) => {
    const data = req.body;
    const { data: newHotel, error } = await supabase.from('Hotels')
        .insert([
            data
        ]).select();
    if (error != null) {
        next(error);
    } else {
        res.status(200).json(newHotel);
    }
};

export const updateHotel = async (req, res, next) => {
    const data = req.body;
    const { data: updatedHotel, error } = await supabase.from('Hotels')
        .update([
            data
        ]).eq('id', req.params.id).select();
    if (error != null) {
        next(error);
    } else {
        res.status(200).json(updatedHotel);
    }
};

export const deleteHotel = async (req, res, next) => {
    try {
        const response = await supabase.from('Hotels')
            .delete()
            .eq('id', req.params.id);
        res.status(200).json("Hotel has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getHotel = async (req, res, next) => {
    const { data: hotel, error } = await supabase.from('Hotels')
        .select()
        .eq('id', req.params.id);

    if (error != null) {
        next(error);
    } else {
        res.status(200).json(hotel);
    }
}

export const getHotels = async (req, res, next) => {
    const {
        city, // Destination filter
        min,
        max,
        limit,
        startDate,
        endDate,
        adults = 1,
        children = 0,
        rooms = 1,
        ...others
    } = req.query;

    const totalGuests = parseInt(adults) + parseInt(children);
    const requiredRooms = parseInt(rooms);

    try {
        // Step 1: First filter hotels by destination if provided
        let hotelBaseQuery = supabase
            .from('Hotels')
            .select('id');

        if (city) {
            hotelBaseQuery = hotelBaseQuery.ilike('city', `%${city}%`);
        }

        // Add other hotel filters (except price)
        for (const [key, value] of Object.entries(others)) {
            if (value) {
                hotelBaseQuery = hotelBaseQuery.eq(key, value);
            }
        }

        const { data: filteredHotels, error: hotelError } = await hotelBaseQuery;

        if (hotelError) throw hotelError;
        if (!filteredHotels || filteredHotels.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No hotels found matching your criteria",
                data: []
            });
        }

        const hotelIds = filteredHotels.map(hotel => hotel.id);

        // Step 2: Find suitable rooms in these hotels
        let roomQuery = supabase
            .from('Rooms')
            .select('hotel')
            .in('hotel', hotelIds)
            .gte('pax', totalGuests);

        // Apply date availability filter if dates are provided
        if (startDate && endDate) {
            const parsedStart = new Date(startDate).toISOString().split('T')[0];
            const parsedEnd = new Date(endDate).toISOString().split('T')[0];

            roomQuery = roomQuery.not('unavailable_dates', 'cs', `{${parsedStart},${parsedEnd}}`);
        }

        const { data: suitableRooms, error: roomsError } = await roomQuery;

        if (roomsError) throw roomsError;
        if (!suitableRooms || suitableRooms.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No hotels found matching your criteria",
                data: []
            });
        }

        // Step 3: Count available rooms per hotel
        const roomsByHotel = suitableRooms.reduce((acc, room) => {
            acc[room.hotel] = (acc[room.hotel] || 0) + 1;
            return acc;
        }, {});

        // Get hotel IDs with enough rooms
        const availableHotelIds = Object.keys(roomsByHotel)
            .filter(hotelId => roomsByHotel[hotelId] >= requiredRooms)
            .map(Number);

        if (availableHotelIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No hotels found matching your criteria",
                data: []
            });
        }

        // Step 4: Final hotel query with all filters
        let finalHotelQuery = supabase
            .from('Hotels')
            .select()
            .in('id', availableHotelIds);

        // Add price range filter
        if (min || max) {
            finalHotelQuery = finalHotelQuery.gt('cheapest_price', min || 1)
                .lt('cheapest_price', max || 999);
        }

        if (limit) {
            finalHotelQuery = finalHotelQuery.limit(parseInt(limit));
        }

        const { data: hotels, error: finalError } = await finalHotelQuery;

        if (finalError) throw finalError;

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};