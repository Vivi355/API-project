import React from 'react';
import { Link } from "react-router-dom";

const SpotIndexItem = ({spot}) => {
    const avgRating = spot.avgRating === '0.00' ? 'New' : spot.avgRating;

    return (
        <>
            <div title={spot.name}>
                <Link to={`/spots/${spot.id}`}>
                    <div className="spot-container">
                        <div className="spot-img">
                            <img src={spot.previewImage} alt={spot.name} className="spot-thumbnail"></img>
                        </div>

                        <div className="spot-detail">
                            <div className="spot-city">{spot.city}, {spot.state}</div>
                            <div className="spot-rating">
                                <i className="fa-solid fa-star"></i>
                                {avgRating}
                            </div>
                            <div className="price">${spot.price} night</div>
                        </div>

                    </div>
                </Link>
            </div>
        </>
    )
}

export default SpotIndexItem;
