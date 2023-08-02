import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SpotShow.css"
import { spotDetailThunk } from "../../store/spots";
import ReviewShow from "../Reviews/ReviewShow"; // reviews section

const SpotShow = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.singleSpot);

    const [isLoading, setIsLoading] = useState(true);
    // console.log('showSpot com:', spot);

    // const preSpotImg = spot && spot.SpotImages?.filter(img => img.preview === true);
    const preSpotImg = spot && spot.SpotImages?.find((img) => img.preview === true);
    const otherImages = spot && spot.SpotImages?.filter(img => img.preview === false);

    useEffect(() => {
        dispatch(spotDetailThunk(spotId))
            .then(() => setIsLoading(false));
    }, [dispatch, spotId]);

    if (isLoading) return null;

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
                <div className="images-section">
                    <div className="big-img">
                        {preSpotImg && <img src={preSpotImg.url} alt="previewImage" />}
                    </div>
                    <div className="small-images">
                        {otherImages.map((img, idx) => (
                            <img key={idx} src={img.url} alt={`SpotImage-${idx}`} />
                        ))}
                    </div>
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
                    <div className="review-star">
                        <i className="fa-solid fa-star"></i>
                        {spot.numReviews !== 0 && <> {spot.avgStarRating} <span>&#183;</span> </>}
                        {spot.numReviews === 0 ? 'New' : `${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`}
                    </div>
                    <div className="reserve-button">
                        <button onClick={() => alert('Feature coming soon')}>Reserve</button>
                    </div>
                </div>

            </div>

            <div id="reviews-section">
                <div className="review-star">
                    <i className="fa-solid fa-star"></i>
                    {spot.numReviews !== 0 && <> {spot.avgStarRating} <span>&#183;</span></>}
                    {spot.numReviews === 0 ? 'New' : `${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`}
                </div>
                <ReviewShow />
            </div>
        </div>
     </div>
    )
}

export default SpotShow;
