import "./list.css";
import { useLocation } from "react-router-dom";
import { ChangeEvent, useState, useEffect } from "react";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { Hotel, DateRange, People } from "../../types"
import { DateRangeInput } from "@cameratajs/react-date-range-input";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useSearch } from "../../context/SearchContext";
import { format } from "date-fns";
import { validCities, isValidCity } from "../../components/ValidCity";


interface LocationState {
  destination?: string;
  dates?: DateRange;
  options?: {
    adult: number;
    children: number;
    room: number;
  };
}


const List = () => {
  const location = useLocation();
  const {
    searchState,
    updateDestination,
    updateDates,
    updateOptions,
    resetSearch
  } = useSearch(); // Use the search context

  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Build search params without triggering fetch
  const buildSearchParams = () => {
    const params = new URLSearchParams({
      city: searchState.destination,
      min: String(min || 0),
      max: String(max || 9999),
      adults: String(searchState.options.adult),
      children: String(searchState.options.children),
      rooms: String(searchState.options.room)
    });

    if (searchState.dates.startDate && searchState.dates.endDate) {

      const startDateStr = format(searchState.dates.startDate, 'yyyy-MM-dd');
      const endDateStr = format(searchState.dates.endDate, 'yyyy-MM-dd');
      params.append('startDate', startDateStr);
      params.append('endDate', endDateStr);

    }

    return params.toString();
  };

  // useFetch with manual trigger
  const { data, loading, error, reFetch } = useFetch<Hotel[]>(
    searchTriggered ? `/hotels?${buildSearchParams()}` : null
  );

  // Initial automatic search
  useEffect(() => {
    if (location.state && !searchTriggered) {
      const state = location.state as LocationState;

      if (state.destination) updateDestination(state.destination);
      if (state.dates) updateDates(state.dates);
      if (state.options) updateOptions(state.options);

      setSearchTriggered(true);
    }
  }, [location.state]);

  const handleDateChange = (newDate: DateRange) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate dates
    let startDate = newDate.startDate;
    let endDate = newDate.endDate;

    if (startDate && startDate < today) startDate = null;
    if (endDate && endDate < today) endDate = null;

    updateDates({ startDate, endDate });
  };

  const handleClick = () => {
    setSearchTriggered(true);
  };

  useEffect(() => {
    if (searchTriggered) {
      reFetch().finally(() => {
        setSearchTriggered(false);
      });
    }
  }, [searchTriggered, reFetch]);

  return (
    <div>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <Autocomplete
                options={validCities}
                fullWidth
                value={searchState.destination}
                renderInput={(params) => <TextField {...params} label="Destination" />}
                onChange={(e, newValue: string | null) => {
                  newValue && updateDestination(newValue);
                }}
                sx={{
                  backgroundColor: "white"
                }}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <DateRangeInput
                startDate={searchState.dates.startDate}
                endDate={searchState.dates.endDate}
                onChange={handleDateChange}
                calendars={2}
                anchor="bottom"
                color="#000000"
                highlightColor="#F97e54"
                highlightRangeColor="#f9d054"
                startDatePlaceholder="Check-in date"
                endDatePlaceholder="Check-out date"
              />
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={searchState.options.adult.toString()}
                    onChange={(e) => updateOptions({
                      adult: parseInt(e.target.value) || 1 // Fallback to 1 if NaN
                    })}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={searchState.options.children.toString()}
                    onChange={(e) => updateOptions({
                      children: parseInt(e.target.value) || 0 // Fallback to 0 if NaN
                    })}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={searchState.options.room.toString()}
                    onChange={(e) => updateOptions({
                      room: parseInt(e.target.value) || 1 // Fallback to 1 if NaN
                    })}
                  />
                </div>
              </div>
            </div>
            <Button
              variant="contained"
              onClick={handleClick}
              disabled={!searchState.dates.startDate || !searchState.dates.endDate || !searchState.destination}
              sx={{ color: "#E1AD01" }}
            >
              Search
            </Button>
          </div>
          <div className="listResult">
            {loading ? (
              "Loading..."
            ) : error ? (
              <div className="noResults">Error loading hotels</div>
            ) : data && data.length > 0 ? (
              data.map((item) => <SearchItem item={item} key={item.id} />)
            ) : (
              <div className="noResults">
                <h3>No hotels found matching your search criteria</h3>
                <p>Try adjusting your filters or search dates</p>
                <Button
                  variant="outlined"
                  onClick={() => {
                    resetSearch();
                    setMin("");
                    setMax("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;