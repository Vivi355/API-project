import { csrfFetch } from "./csrf";;

// action types
export const RECEIVE_SPOT_REVIEWS = 'reviews/RECEIVE_SPOT_REVIEWS';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
export const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

/************* Action Creators *****************/
const receiveReviews = (reviews) => ({
        type: RECEIVE_SPOT_REVIEWS,
        reviews
});

const createReview = (review) => ({
    type: CREATE_REVIEW,
    review,
});

const deleteReview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId,
})


/***************** Thunk creators **************/
// load all reviews of the current spot id
export const fetchReviews = (spotId) => async (dispatch, getState) => {
    // console.log('in fetch review thunk');
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
        const data = await res.json();

        dispatch(receiveReviews(data.Reviews));
        // console.log('review thunk:', data.Reviews); // [{}, {}]

    }
}

// create review
export const createReviewThunk = (review, spotId) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review),
    })

    if (res.ok) {
        const newReview = await res.json();
        dispatch(createReview(newReview));
        return newReview;
    } else {
        const errors = await res.json();
        return errors;
    }
}

// delete review
export const removeReview = (reviewId) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
    })

    if (res.ok) {
        dispatch(deleteReview(reviewId));
    } else {
        const errors = await res.json();
        return errors;
    }
}


/*************** Reducer ************************/
const initialState = {spot: {}, user: {}};
const reviewsReducer = (state = initialState, action) => {
    // console.log('action in review reducer!!!!!!', action);
    let newState;
    switch (action.type) {
        case RECEIVE_SPOT_REVIEWS:
            newState = {...state};
            const spotReviews = {};
            // console.log('action in the reducer:', action);
            action.reviews.forEach(review => {
                spotReviews[review.id] = review;
            })
            newState.spot = spotReviews;
            // console.log('new state in the reducer', newState);
            return newState;
        case CREATE_REVIEW:
            newState = {...state};
            newState.spot = {...newState.spot, [action.review.id]: action.review};
            return newState;
        case REMOVE_REVIEW:
            newState = {...state};
            let newSpot = {...newState.spot};
            delete newSpot[action.reviewId];
            newState.spot = newSpot;
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;
