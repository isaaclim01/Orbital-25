import supabase from "../index.js";

export const createRoom = async (req, res, next) => {
    try {
        const roomData = req.body;
        const { roomNumbers } = roomData;
        
        // Validate input
        if (!roomNumbers || !Array.isArray(roomNumbers) || roomNumbers.length === 0) {
            throw new Error('roomNumbers must be a non-empty array');
        }

        // Remove roomNumbers from the base data (we'll add it back for each room)
        const { roomNumbers: _, ...baseRoomData } = roomData;

        // Create an array of room objects with unique room numbers
        const roomsToInsert = roomNumbers.map(roomNumber => ({
            ...baseRoomData,
            room_number: roomNumber,
        }));

        // Insert all rooms in a single batch
        const { data: createdRooms, error } = await supabase
            .from('Rooms')
            .insert(roomsToInsert)
            .select();

        if (error) throw error;
        
        res.status(200).json(createdRooms);
    } catch (error) {
        next(error);
    }
};

export const updateRoom = async (req, res, next) => {
    const data = req.body;
    const roomId = req.params.id;

    const { data: updatedRoom, error } = await supabase.from('Rooms')
        .update([
            data
        ]).eq('id', roomId).select();
    if (error != null) {
        next(error);
    } else {
        res.status(200).json(updatedRoom);
    }
};

export const updateRoomAvailability = async (req, res, next) => {
    try {
        const { datesToAdd } = req.body;
        const roomId = req.params.id;

        // Validate input
        if (!Array.isArray(datesToAdd)) {
            return res.status(400).json({ error: 'datesToAdd must be an array of date strings' });
        }

        // First get current unavailable dates
        const { data: currentRoom, error: fetchError } = await supabase
            .from('Rooms')
            .select('unavailable_dates')
            .eq('id', roomId);

        if (fetchError) throw fetchError;

        // Merge arrays and remove duplicates
        const updatedDates = [...new Set([
            ...(currentRoom.unavailable_dates || []),
            ...datesToAdd
        ])];

        // Update the room with merged dates
        const { data: updatedRoom, error: updateError } = await supabase
            .from('Rooms')
            .update({ 
                unavailable_dates: updatedDates 
            })
            .eq('id', roomId)
            .select();

        if (updateError) throw updateError;
        
        res.status(200).json(updatedRoom);
    } catch (error) {
        next(error);
    }
};

export const deleteRoom = async (req, res, next) => {
    try {
        const response = await supabase.from('Rooms')
            .delete()
            .eq('id', req.params.id);
        res.status(200).json("Room has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getRoom = async (req, res, next) => {
    const { data: room, error } = await supabase.from('Rooms')
        .select()
        .eq('id', req.params.id);

    if (error != null) {
        next(error);
    } else {
        res.status(200).json(room);
    }
}

export const getRooms = async (req, res, next) => {
    const { data: rooms, error } = await supabase.from('Rooms')
        .select();

    if (error != null) {
        next(error);
    } else {
        res.status(200).json(rooms);
    }
}

export const getRoomsByHotel = async (req, res, next) => {
    const { data: rooms, error } = await supabase.from('Rooms')
    .select()
    .eq('hotel', req.params.hotelid);

    if (error != null) {
        next(error);
    } else {
        res.status(200).json(rooms);
    }
}