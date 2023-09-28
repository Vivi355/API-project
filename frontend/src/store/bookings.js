import { csrfFetch } from "./csrf";

// action types
export const LOAD_BOOKINGS = 'bookings/LOAD_BOOKINGS';
export const CREATE_BOOKING = 'bookings/CREATE_BOOKING';
export const REMOVE_BOOKING = 'bookings/REMOVE_BOOKING';

// action creators
const loadBookings = (bookings) => ({
    type: LOAD_BOOKINGS,
    bookings
})

const createBooking = (booking) => ({
    type: CREATE_BOOKING,
    booking
})

const deleteBooking = (bookingId) => ({
    type: REMOVE_BOOKING,
    bookingId
})

// thunk
// get all of the current user's booking
export const fetchBookings = () => async(dispatch) => {
    const res = await csrfFetch(`/api/bookings/current`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadBookings(data.Bookings))
        // console.log('thunk data:', data);
    }
}

// create booking
export const addBooking= (booking) => async(dispatch) => {
    const {spotId, startDate, endDate} = booking;

    const res = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({startDate, endDate})
    })

    if (res.ok) {
        const booking = await res.json();
        dispatch(createBooking(booking));
        return booking;
    } else {
        const data = await res.json();
        if (data && data.errors) throw data.errors;
    }
}

/***************** Reducer ******************/
const initialState = {bookings: {}};
const bookingsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_BOOKINGS:
            newState = {...state};
            action.bookings.forEach(booking => {
                newState.bookings[booking.id] = booking;
            })
            return newState;

        case CREATE_BOOKING:
            newState = {...state};
            newState.bookings = {...newState.bookings, [action.booking.id]: action.booking};
            return newState
        default:
            return state
    }
}

export default bookingsReducer;
