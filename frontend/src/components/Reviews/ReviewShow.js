import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
// import {format} from 'date-fns'
import { fetchReviews } from "../../store/reviews";

const ReviewShow = () => {
    const dispatch = useDispatch();
    const {spotId} = useParams();

    let reviews = useSelector(state => Object.values(state.reviews?.spot ? Object.values(state.reviews.spot) : []));
    const user = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots?.singleSpot);

    // sort reviews
    reviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    useEffect(() => {
        dispatch(fetchReviews(spotId))
    }, [dispatch, spotId])

    return (
        <div>
            {/* only if the user is logged in and hasn't posted a review and is not the owner of the spot, .some() find truthy*/}
            {user && !reviews.some(review => review.userId === user.id) && user.id !== spot.Owner.id && (
                <button>Post Your Review</button>
            )}

            {reviews.length === 0 && user && user.id !== spot.Owner.id ?
                <p>Be the first to post a review!</p>
                :
                reviews.map(review => (
                    <div key={review.id}>
                        <p>{review.User.firstName}</p>
                        <p>{new Date(review.createdAt).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                        <p>{review.review}</p>
                    </div>
                ))
            }
        </div>
    )

}

export default ReviewShow;
