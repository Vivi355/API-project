import { csrfFetch } from "./csrf";

// action types
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';

/************ Action creators *************/
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
})


/********** Thunk Creators *****************/
export const spotDetailThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    // console.log('getting data for single spot');

    if (res.ok) {
        const data = await res.json();
        dispatch(receiveSpot(data));
        console.log('detail thunk:', data);
        return data;
    }
}

// display all spots
export const fetchSpots = () => async dispatch => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const data = await res.json();

        dispatch(loadSpots(data.spots));
        // console.log('thunk:', data.spots); // [{},{},{},{}] of spots
    }
}



/***************** Reducer *****************/
const initialState = {allSpots: {}, singleSpot: {}};
const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOTS:
            newState = {...state, allSpots: {...state.allSpots}, singleSpot: {}};
            action.spots.forEach(spot => {
                newState.allSpots[spot.id] = spot;
            })
            return newState;
        case RECEIVE_SPOT:
            newState = {...state};
            newState.singleSpot = action.spot;
            console.log('reducer singlespot:', newState);
            return newState;
        default:
            return state;
    }
}

export default spotsReducer;
