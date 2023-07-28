import { csrfFetch } from "./csrf";

// action for set user and remove user
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

/********************** action creator ***************************/
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user,
    }
}

const removeUser = () => {
    return {
        type: REMOVE_USER,
    }
}

/******************** thunk creator *******************************/
export const login = (user) => async dispatch => {
    const {credential, password} = user;
    const res = await csrfFetch('api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        }),
    });

    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
};

// restore sessoin user
export const restoreUser = () => async dispatch => {
    const res = await csrfFetch('/api/session');
    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
}

// user sign up thunk
export const signup = (user) => async dispatch => {
    const {username, firstName, lastName, email, password} = user;
    const res = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password,
        }),
    });

    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
}

// user logout action thunk
export const logout = () => async dispatch => {
    const res = await csrfFetch('api/session', {
        method: 'DELETE'
    });

    dispatch(removeUser());
    return res;
}


/************************** Reducer ****************************/
const initialState = {user: null};

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case SET_USER:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
};

export default sessionReducer;
