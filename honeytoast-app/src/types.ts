import React from "react";

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

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface People {
  adult: number;
  children: number;
  room: number;
}

export interface SearchState {
  destination: string;
  dates: DateRange;
  options: People;
  minPrice: number;
  maxPrice: number;
}

export interface SearchContextType {
  searchState: SearchState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  updateDestination: (destination: string) => void;
  updateDates: (dates: DateRange) => void;
  updateOptions: (options: Partial<People>) => void;
  updatePriceRange: (min: number, max: number) => void;
  resetSearch: () => void;
}