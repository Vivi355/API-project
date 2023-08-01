import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import "./SpotShow.css"
import { spotDetailThunk } from "../../store/spots";

const SpotShow = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.singleSpot);
    // console.log('showSpot com:', spot);

    // const preSpotImg = spot.SpotImages?.filter(img => img.preview === true);
    const preSpotImg = spot.SpotImages?.find((img) => img.preview === true);

    useEffect(() => {
        dispatch(spotDetailThunk(spotId));
    }, [dispatch, spotId]);

    if (!spot || Object.keys(spot).length === 0) return null;

    return (
        <div id="single-spot-container">
            <div className="spot-name-and-location">
                <h2>
                    {spot.name}
                </h2>
                <p>
                    {spot.city}, {spot.state}, {spot.country}
                </p>
            </div>

            <div className="single-spot-img">
                <div>
                {preSpotImg && <img src={preSpotImg.url} alt="previewImage" />}
            </div>

            <div className="single-spot-detail-container">
                <div className="bottom-left">
                    <div className="spot-host">
                        <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                    </div>
                    <div className="spot-description">
                        {spot.description}
                    </div>
                </div>
                <div className="bottom-right">
                    <div className="price-tag">
                        ${spot.price} night
                    </div>
                    <div className="star-rating">
                        <i className="fa-solid fa-star"></i>{spot.avgStarRating}
                    </div>
                    <div className="review-num">
                        {spot.numReviews} reviews
                    </div>
                    <div className="reserve-button">
                        <button>Reserve</button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default SpotShow;
