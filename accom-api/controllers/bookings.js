import supabase from "../index.js";

export const createBooking = async (req, res, next) => {
    const data = req.body;
    const { data: newBooking, error } = await supabase.from('Bookings')
        .insert([
            data
        ]).select();
    if (error != null) {
        next(error);
    } else {
        res.status(200).json(newBooking);
    }
};

export const updateBooking = async (req, res, next) => {
    const data = req.body;
    const { data: updatedBooking, error } = await supabase.from('Bookings')
        .update([
            data
        ]).eq('id', req.params.id).select();
    if (error != null) {
        next(error);
    } else {
        res.status(200).json(updatedBooking);
    }
};

export const deleteBooking = async (req, res, next) => {
    try {
        const response = await supabase.from('Bookings')
            .delete()
            .eq('id', req.params.id);
        res.status(200).json("Booking has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getBooking = async (req, res, next) => {
    const { data: Booking, error } = await supabase.from('Bookings')
        .select()
        .eq('id', req.params.id);

    if (error != null) {
        next(error);
    } else {
        res.status(200).json(Booking);
    }
};

export const getAllBookings = async (req, res, next) => {
    const { data: Bookings, error } = await supabase.from('Bookings')
        .select();

    if (error != null) {
        next(error);
    } else {
        res.status(200).json(Bookings);
    }
};
