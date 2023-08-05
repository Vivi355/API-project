import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchReviews } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import CreateReview from "./CreateReview"; // create
import DeleteReviewModal from "../DeleteReviewModal";
import "./ReviewShow.css"


const ReviewShow = ({setReviewChange}) => {
    const dispatch = useDispatch();
    const {spotId} = useParams();

    let reviews = useSelector(state => Object.values(state.reviews?.spot ? Object.values(state.reviews.spot) : []));
    const user = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots?.singleSpot);

    const {openModal} = useModal(); // consume context

    // re render reviews
    const [reviewCreated, setReviewCreated] = useState(false);

    // sort reviews
    reviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    useEffect(() => {
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId, reviewCreated])


    // modal popup
    const handleClick = () => {
        openModal(<CreateReview
            spotId={spotId}
            setReviewChange={setReviewChange}
            setReviewCreated={setReviewCreated}
        />)
    }

    // handle delete
    const handleDelete = (reviewId) => {
        openModal(<DeleteReviewModal reviewId={reviewId} setReviewChange={setReviewChange} />);
    }


    return (
        <div>
            {/* only if the user is logged in and hasn't posted a review and is not the owner of the spot, .some() find truthy*/}
            <div className="post-review-button">
                {user && !reviews.some(review => review.userId === user.id) && spot && spot.Owner && user.id !== spot.Owner.id && (
                    <button onClick={handleClick}>Post Your Review</button>
                )}
            </div>

            {reviews.length === 0 && user && spot && spot.Owner && user.id !== spot.Owner.id ?
                <p>Be the first to post a review!</p>
                :
                reviews.map(review => (
                    <div className="reviews-details" key={review.id}>
                        <p className="review-firstname">{review.User?.firstName}</p>
                        <p className="review-date">{new Date(review.createdAt).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                        <p className="review-content">{review.review}</p>
                        {/* delete review button */}
                        {user && user.id === review.userId && (
                            <button onClick={() => handleDelete(review.id)}>Delete</button>
                        )}
                    </div>
                ))
            }
        </div>
    )

}

export default ReviewShow;
