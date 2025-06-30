export interface Trip {
    id: number;
    start: string;
    destination: string;
    start_date: string;
    end_date: string;
    pax: number;
    user_id: string;
}

export interface Hotel {
    id: number;
    name: string;
    type: string;
    city: string;
    address: string;
    description: string;
    distance: number;
    photos: string[];
    rating: number;
    cheapest_price: number;
    featured: boolean;
}