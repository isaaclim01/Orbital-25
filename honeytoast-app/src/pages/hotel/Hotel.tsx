import "./hotel.css";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Hotel as HotelType } from "../../types";

interface HotelProps {
    user: User | null;
}

interface FetchResult {
    data: HotelType[] | null;
    loading: boolean;
    error: Error | null;
}

const Hotel = ({ user }: HotelProps) => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [slideNumber, setSlideNumber] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [days, setDays] = useState<number>(1); // Added missing state
    const [options, setOptions] = useState({ room: 1 }); // Added missing state

    const { data, loading, error }: FetchResult = useFetch(`/hotels/find/${id}`);
    const navigate = useNavigate();

    const handleOpen = (i: number) => {
        setSlideNumber(i);
        setOpen(true);
    };

    const handleMove = (direction: "l" | "r") => {
        let newSlideNumber: number;

        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
        } else {
            newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
        }

        setSlideNumber(newSlideNumber);
    };

    const handleClick = () => {
        if (user) {
            setOpenModal(true);
        } else {
            navigate("/login");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading hotel data</div>;
    if (!data) return <div>No hotel data available</div>;
    console.log("Fetched data:", data);

    return (
        <div>
            {open && (
                <div className="slider">
                    <div className="sliderWrapper">
                        <img
                            src={data[0].photos?.[slideNumber]}
                            alt=""
                            className="sliderImg"
                        />
                        <div className="sliderActions">
                            <span className="close" onClick={() => setOpen(false)}>
                                X
                            </span>
                            <span className="arrow left" onClick={() => handleMove("l")}>
                                ←
                            </span>
                            <span className="arrow right" onClick={() => handleMove("r")}>
                                →
                            </span>
                        </div>
                    </div>
                </div>
            )}
            <div className="hotelWrapper">
                <button className="bookNow">Reserve or Book Now!</button>
                <h1 className="hotelTitle">{data[0].name}</h1>
                <div className="hotelAddress">
                    <span>{data[0].address}</span>
                </div>
                <span className="hotelDistance">
                    Excellent location – {data[0].distance}m from center
                </span>
                <span className="hotelPriceHighlight">
                    Book a stay over ${data[0].cheapest_price} at this property and get a
                    free airport taxi
                </span>
                <div className="hotelImages">
                    {data[0].photos?.map((photo, i) => (
                        <div className="hotelImgWrapper" key={i}>
                            <img
                                onClick={() => handleOpen(i)}
                                src={photo}
                                alt=""
                                className="hotelImg"
                            />
                        </div>
                    ))}
                </div>
                <div className="hotelDetails">
                    <div className="hotelDetailsTexts">
                        <p className="hotelDesc">{data[0].description}</p>
                    </div>
                    <div className="hotelDetailsPrice">
                        <h1>Perfect for a {days}-night stay!</h1>
                        <span>
                            Located in the real heart of Krakow, this property has an
                            excellent location score of 9.8!
                        </span>
                        <h2>
                            <b>${days * data[0].cheapest_price * options.room}</b> ({days}{" "}
                            nights)
                        </h2>
                        <button onClick={handleClick}>Reserve or Book Now!</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hotel;