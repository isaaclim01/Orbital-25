import "./hotel.css";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Hotel as HotelType } from "../../types";
import { FaMapMarkerAlt } from "react-icons/fa";
import hotelFallback from '../../hotel.png';
import Reserve from "../../components/reserveAccom/Reserve";

interface HotelProps {
    user: User;
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

    const { data, loading, error }: FetchResult = useFetch(`/hotels/find/${id}`);
    const navigate = useNavigate();

    // Safe photo access with fallback
    const getPhotos = (): string[] => {
        if (!data?.[0]?.photos) return [hotelFallback];
        return data[0].photos.length > 0 ? data[0].photos : [hotelFallback];
    };

    const handleOpen = (i: number) => {
        const photos = getPhotos();
        if (photos.length <= 1) return; // Don't open if only fallback image
        setSlideNumber(i);
        setOpen(true);
    };

    const handleMove = (direction: "l" | "r") => {
        const photos = getPhotos();
        const photoCount = photos.length;
        if (photoCount <= 1) return; // No navigation for single image

        let newSlideNumber: number;
        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? photoCount - 1 : slideNumber - 1;
        } else {
            newSlideNumber = slideNumber === photoCount - 1 ? 0 : slideNumber + 1;
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

    if (loading) return <div className="loading-message">Loading...</div>;
    if (error) return <div className="error-message">Error loading hotel data</div>;
    if (!data || !data[0]) return <div className="no-data-message">No hotel data available</div>;

    const hotel = data[0];
    const photos = getPhotos();
    const showGalleryControls = photos.length > 1 && photos[0] !== hotelFallback;

    return (
        <div className="hotel-container">
            {/* Image Gallery */}
            <div className="hotel-gallery">
                <img
                    src={photos[slideNumber]}
                    alt={hotel.name}
                    className="hotel-main-image"
                    onClick={() => showGalleryControls && handleOpen(slideNumber)}
                    onError={(e) => {
                        e.currentTarget.src = hotelFallback;
                        e.currentTarget.alt = "Fallback hotel image";
                    }}
                />

                {showGalleryControls && (
                    <>
                        <button
                            className="gallery-arrow left"
                            onClick={() => handleMove("l")}
                            aria-label="Previous image"
                        >
                            &lt;
                        </button>
                        <button
                            className="gallery-arrow right"
                            onClick={() => handleMove("r")}
                            aria-label="Next image"
                        >
                            &gt;
                        </button>
                    </>
                )}

                {showGalleryControls && (
                    <div className="hotel-thumbnails">
                        {photos.map((photo, i) => (
                            <img
                                key={`${photo}-${i}`} // Unique key with photo URL and index
                                src={photo}
                                alt={`Thumbnail ${i + 1} of ${hotel.name}`}
                                className="hotel-thumbnail"
                                onClick={() => setSlideNumber(i)}
                                onError={(e) => {
                                    e.currentTarget.src = hotelFallback;
                                    e.currentTarget.alt = "Fallback thumbnail";
                                }}
                            />
                        ))}
                    </div>
                )}

                {photos[0] === hotelFallback && (
                    <div className="no-photos-message">
                        No photos available for this hotel
                    </div>
                )}
            </div>

            <div className="hotel-details">
                <div className="hotel-info">
                    <h1 className="hotel-title">{hotel.name}</h1>
                    <div className="hotel-address">
                        <FaMapMarkerAlt />
                        <span>{hotel.address}</span>
                    </div>
                    <div className="hotel-distance">{hotel.distance}m from center</div>
                    <div className="hotel-highlight">Free cancellation available</div>
                    <p className="hotel-description">{hotel.description}</p>
                </div>

                <div className="hotel-booking">
                    <div className="hotel-price">
                        ${hotel.cheapest_price} <span>per night</span>
                    </div>
                    <button className="book-button" onClick={handleClick}>
                        Reserve or Book Now!
                    </button>
                </div>
            </div>

            {/* Modal */}
            {openModal && (
                <div className="modal-overlay" onClick={() => setOpenModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setOpenModal(false)}>
                            &times;
                        </button>
                        <Reserve hotelId={parseInt(id)} setOpen={setOpenModal} user={user}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotel;