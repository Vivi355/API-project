import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { createReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import "./CreateReview.css";

const CreateReview = ({spotId}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [review, setReview] = useState('');
    // const [stars, setStars] = useState(0);
    const {closeModal} = useModal();
    const [errors, setErrors] = useState({});

    // init stars array
    const starArray = [1, 2, 3, 4, 5];
    const [selectedStars, setSelectedStars] = useState(0);
    const [hoverStars, setHoverStars] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newReview = {
            review,
            stars: selectedStars,
        };

        const createdReview = await dispatch(createReviewThunk(newReview, spotId));
        if (!createdReview.errors) {
            setReview('');
            setSelectedStars(0);
            closeModal();
            history.push(`/spots/${spotId}`)
        } else {
            setErrors(createdReview);
        }
    }

    return (
      <div id="review-popup">
        <form onSubmit={handleSubmit}>
            <h2>How was your stay?</h2>
            <div className="review-box">
                <textarea
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    placeholder="Leave your review here..."
                />
            </div>

            <div className="stars">
                {starArray.map((star, i) => (
                <i
                    key={i}
                    className={i < (hoverStars || selectedStars) ? 'fa-solid fa-star filled' : 'fa-regular fa-star'}
                    onMouseEnter={() => setHoverStars(i + 1)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => setSelectedStars(i + 1)}
                />
                ))} Stars
            </div>

            <div className="submit-review-button">
                <button type="submit" disabled={review.length < 10 || selectedStars === 0}>
                    Submit Your Review
                </button>
            </div>
        </form>
      </div>
    )

}

export default CreateReview;
