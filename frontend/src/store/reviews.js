import { csrfFetch } from "./csrf";;

// action types
export const RECEIVE_SPOT_REVIEWS = 'reviews/RECEIVE_SPOT_REVIEWS';
export const CREATE_REVIEW = 'reviews/CREATE_REVIEW';

/************* Action Creators *****************/
const receiveReviews = (reviews) => ({
        type: RECEIVE_SPOT_REVIEWS,
        reviews
});

const createReview = (review) => ({
    type: CREATE_REVIEW,
    review,
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
            return {
                ...state,
                [action.review.id]: action.review,
              };
        default:
            return state;
    }
}

export default reviewsReducer;
