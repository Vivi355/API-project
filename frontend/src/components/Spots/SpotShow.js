import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SpotShow.css"
import { spotDetailThunk } from "../../store/spots";
import ReviewShow from "../Reviews/ReviewShow"; // reviews section

// booking
import { addBooking } from "../../store/bookings";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SpotShow = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots.singleSpot);
    const bookings = useSelector(state => state.bookings.bookings);
    // console.log(bookings);

    const [isLoading, setIsLoading] = useState(true);

    // keep track the review changing
    const [reviewChange, setReviewChange] = useState(false);

    // const preSpotImg = spot && spot.SpotImages?.filter(img => img.preview === true);
    const preSpotImg = spot && spot.SpotImages?.find((img) => img.preview === true);
    const otherImages = spot && spot.SpotImages?.filter(img => img.preview === false);

    // booking
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookedDates, setBookedDates] = useState([]);

    function getDatesBetween(startDate, endDate) {
        const dates = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            dates.push(new Date(date));
        }

        return dates;
    }

    // handle click on reserve button
    const handleReserve = async() => {
        if (isBooking) return;

        if (!startDate || !endDate) {
            alert('Please select a start and end date');
            return;
        }

        setIsBooking(true);

        try {
            await dispatch(addBooking({
                spotId,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            }))
            history.push('/bookings/current');
        } catch(error) {
            console.error('Error booking the spot', error)
        } finally {
            setIsBooking(false);
        }
    }

    // fetch single spot detail
    useEffect(() => {
        dispatch(spotDetailThunk(spotId))
            .then(() => {
                setIsLoading(false);
                setReviewChange(false);
            });
    }, [dispatch, spotId, reviewChange]);


    // select dates for booking
    useEffect(() => {
        let bookedArr = [];

        if (bookings) {
            const spotBookings = Object.values(bookings).filter(booking => booking.spotId == spotId);
            // console.log(spotBookings);

            spotBookings.forEach(booking => {
                const startDate = new Date(booking.startDate)
                const endDate = new Date(booking.endDate);
                bookedArr = [...bookedArr, ...getDatesBetween(startDate, endDate)]
            })
        }
        setBookedDates(bookedArr);
    }, [spotId, bookings])

    // useEffect(() => {
    //     console.log(bookedDates);
    // }, [bookedDates])


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
                        {otherImages && otherImages.length > 0 && otherImages.map((img, idx) => (
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
                        <div className="rs">
                            <div className="price-tag">
                                <span className="bold-price">${spot.price}</span> night
                            </div>
                            <div className="review-star">
                                <i className="fa-solid fa-star"></i>
                                {spot.numReviews !== 0 && <> {spot.avgStarRating} <span>&#183;</span> </>}
                                {spot.numReviews === 0 ? 'New' : `${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`}
                            </div>
                        </div>

                        <div className="reserve-button">
                            <div className="date-pickers-container">

                                <div className="date-picker">
                                    <label>Start Date:</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        excludeDates={bookedDates}
                                    />
                                </div>
                                <div className="date-picker">
                                    <label>End Date:</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        endDate={endDate}
                                        minDate={startDate}
                                        excludeDates={bookedDates}
                                    />
                                </div>
                            </div>
                            <button className="reverse-btn" onClick={handleReserve}>Reserve</button>
                        </div>
                    </div>
                </div>

                <div id="reviews-section">
                    <div className="review-star">
                        <i className="fa-solid fa-star"></i>
                        {spot.numReviews !== 0 && <> {spot.avgStarRating} <span>&#183;</span> </>}
                        {spot.numReviews === 0 ? 'New' : `${spot.numReviews} ${spot.numReviews === 1 ? 'review' : 'reviews'}`}
                    </div>
                    <ReviewShow setReviewChange={setReviewChange} />
                </div>
            </div>
        </div>
    )
}

export default SpotShow;
