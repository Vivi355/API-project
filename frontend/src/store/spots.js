import { csrfFetch } from "./csrf";

// action types
export const LOAD_SPOTS = 'spots/LOAD_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT';
// export const CREATE_SPOT = 'spots/CREATE_SPOT'

export const RECEIVE_SPOT_IMG = 'spots/RECEIVE_SPOT_IMG'

/************ Action creators *************/
const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
});

const receiveSpot = (spot) => ({
    type: RECEIVE_SPOT,
    spot,
})

const receiveSpotImg = (spotId, images) => ({
    type: RECEIVE_SPOT_IMG,
    spotId, images
})


/********** Thunk Creators *****************/
export const spotDetailThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    // console.log('getting data for single spot');

    if (res.ok) {
        const data = await res.json();
        dispatch(receiveSpot(data));
        // console.log('detail thunk:', data);
        return data;
    }
}

// create spot
export const createSpotThunk = (spot, images) => async (dispatch, getState) => {
    console.log('spot thunk', spot);
    console.log('spotimge thunk', images);
    const res = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(spot)
    })
    console.log('after fetch', res);
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
        // case CREATE_SPOT:
            // newState = {...state, singleSpot: {...state.singleSpot}, allSpots: {...state.allSpots}};
            // newState.singleSpot = action.spot;
            // newState.allSpots[action.spot.id] = action.spot;
            // return newState
        default:
            return state;
    }
}

export default spotsReducer;
