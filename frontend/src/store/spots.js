import { csrfFetch } from "./csrf";

// action types
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
export const RECEIVE_SPOT_IMG = 'spots/RECEIVE_SPOT_IMG'
export const SET_CURRENT_USER_SPOTS = 'spots/SET_CURRENT_USER_SPOT';
export const UPDATE_SPOT = 'spots/UPDATE_SPOT';
export const REMOVE_SPOT = 'spots/REMOVE_SPOT';

/************ Action creators *************/
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
});

const receiveSpotImg = (spotId, images) => ({
    type: RECEIVE_SPOT_IMG,
    spotId, images
});

const setCurrUserSpots = (spots) => ({
    type: SET_CURRENT_USER_SPOTS,
    spots,
});

const updateSpot = (spot) => ({
    type: UPDATE_SPOT,
    spot,
});

const removeSpot = (spotId) => ({
    type: REMOVE_SPOT,
    spotId,
});

/********** Thunk Creators *****************/
// single spot detail
export const spotDetailThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    // console.log('getting data for single spot');

    if (res.ok) {
        const data = await res.json();
        // console.log('spot data from api', data);
        dispatch(receiveSpot(data));
        // console.log('detail thunk:', data);
        return data;
    }
}

// delete spot
export const deleteSpot = (spotId) => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    })

    if (res.ok) {
        dispatch(removeSpot(spotId));
    } else {
        const errors = await res.json();
        return errors;
    }
}

// create spot
export const createSpotThunk = (spot, images) => async (dispatch, getState) => {
    // console.log('spot thunk', spot);
    // console.log('spotimge thunk', images);
    const res = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    })
    // console.log('after fetch', res);
    if (res.ok) {
        const newSpot = await res.json();
        dispatch(receiveSpot(newSpot));

        const spotImages = [];
        for (let i = 0; i < images.length; i++) {
            let image = images[i];
            if (image.url) {
                const imgRes = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                        {url: image.url, preview: image.preview}
                    )
                });

                if (imgRes.ok) {
                    const newImage = await imgRes.json();
                    spotImages.push(newImage);
                }
            }
        }

        dispatch(receiveSpotImg(newSpot.id, spotImages));
        return newSpot;
    } else {
        const errors = await res.json()
        return errors;
    }
}

// edit spot
export const updateSpotThunk = spot => async (dispatch, getState) => {
    const res = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(spot),
    });

    if (res.ok) {
        const updatedSpot = await res.json();
        dispatch(updateSpot(updatedSpot));
        return updatedSpot;
    } else {
        const errors = await res.json();
        return errors;
    }
}

// current user spots
export const loadCurrentUserSpot = () => async (dispatch, getState) => {
    const res = await csrfFetch('/api/spots/current');
    if (res.ok) {
        const {Spots: spots} = await res.json();
        dispatch(setCurrUserSpots(spots));
        // console.log('load spots', spots); {Spots: [{spot1}, {spot2}] }
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
            // console.log('reducer recived action', action);
            newState = {...state};
            newState.singleSpot = action.spot;
            // console.log('reducer singlespot:', newState);
            return newState;
        case RECEIVE_SPOT_IMG:
            newState = {...state};
            if (newState.allSpots[action.spotId]) {
                newState.allSpots[action.spotId].SpotImages = action.images;
            } else {
                newState.allSpots[action.spotId] = {
                SpotImages: action.images
                }
            }
            return newState
        case SET_CURRENT_USER_SPOTS:
            return {...newState, userSpots: action.spots}
        case UPDATE_SPOT:
            newState = {...state};
            newState.singleSpot = action.spot;
            return newState;
        case REMOVE_SPOT:
            newState = {...state};
            delete newState[action.spotId];
            return newState;
        default:
            return state;
    }
}

export default spotsReducer;
