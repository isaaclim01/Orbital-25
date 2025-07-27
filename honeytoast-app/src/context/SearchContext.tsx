import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SearchContextType, SearchState, DateRange, People } from '../types';


const defaultState: SearchState = {
  destination: '',
  dates: { startDate: null, endDate: null },
  options: { adult: 1, children: 0, room: 1 },
  minPrice: 0,
  maxPrice: 9999,
};

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchState, setSearchState] = useState<SearchState>(defaultState);

  // Helper functions...
  const updateDestination = (destination: string) => {
    setSearchState(prev => ({ ...prev, destination }));
  };

  const updateDates = (dates: DateRange) => {
    setSearchState(prev => ({ ...prev, dates }));
  };

  const updateOptions = (options: Partial<People>) => {
    setSearchState(prev => ({
      ...prev,
      options: { ...prev.options, ...options }
    }));
  };

  const updatePriceRange = (min: number, max: number) => {
    setSearchState(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const resetSearch = () => {
    setSearchState(defaultState);
  };

  return (
    <SearchContext.Provider
      value={{
        searchState,
        setSearchState,
        updateDestination,
        updateDates,
        updateOptions,
        updatePriceRange,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};