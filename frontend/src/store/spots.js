import { csrfFetch } from "./csrf";

// action types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';

/************ Action creators *************/
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});


/********** Thunk Creators *****************/
// display all spots
export const fetchSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const data = await res.json();

        dispatch(loadSpots(data.spots));
        console.log('thunk:', data.spots); // [{},{},{},{}] of spots
    }
}

/***************** Reducer *****************/
const initialState = {allSpots: {}, singleSpot: {}};
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            const newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}};
            action.spots.forEach(spot => {
                newState.allSpots[spot.id] = spot;
            })
            return newState;
        default:
            return state;
    }
}

export default spotsReducer;
