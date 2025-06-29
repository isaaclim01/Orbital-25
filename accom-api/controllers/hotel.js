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
  const { min, max, limit, ...others } = req.query;
  
  try {
    
    // Build the query
    let query = supabase
      .from('Hotels')
      .select();
    
    // Add filters from query parameters
    for (const [key, value] of Object.entries(others)) {
      if (value) {
        query = query.eq(key, value);
      }
    }
    
    // Add price range filter
    if (min || max) {
      query = query.gt('cheapest_price', min || 1)
                   .lt('cheapest_price', max || 999);
    }
    
    // Add limit if specified
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    // Execute the query
    const { data: hotels, error } = await query;
    
    if (error) throw error;
    
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};