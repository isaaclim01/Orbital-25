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
