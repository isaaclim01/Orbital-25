import { Link } from "react-router-dom";
import "./searchItem.css";
import { Hotel } from '../../types'
import hotelFallback from '../../hotel.png';
import Rating from '@mui/material/Rating';

interface SearchItemProps {
  item: Hotel;
}


const SearchItem = ({ item }: SearchItemProps) => {
  const imageUrl = item.photos?.[0] || hotelFallback;

  return (
    <div className="searchItem">
      <img 
        src={imageUrl} 
        alt={item.name} 
        className="siImg"
        onError={(e) => {
          e.currentTarget.src = hotelFallback;
        }}
      />
      <div className="siContent">
        <div className="siDesc">
          <h1 className="siTitle">{item.name}</h1>
          <Rating className="siRating" value={item.rating} readOnly/>
          <span className="siDistance">{item.distance}m from center</span>
          <span className="siFeatures">{item.description}</span>
          <span className="siCancelOp">Free cancellation </span>
          <span className="siCancelOpSubtitle">
            You can cancel later, so lock in this great price today!
          </span>
        </div>
        <div className="siDetails">
          <span className="siPrice">${item.cheapest_price}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <Link to={`/hotels/${item.id}`}>
            <button className="siCheckButton">See availability</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
