import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteBooking.css';
import { removeBooking, fetchBookings } from '../../store/bookings';

function DeleteBookingModal ({bookingId}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const handleDelete = async (bookingId) => {
        await dispatch(removeBooking(bookingId));
        closeModal();
        dispatch(fetchBookings());
    }

    return (
        <div className='delete-popup'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this booking?</p>

            <button
                className='delete-button'
                onClick={() => handleDelete(bookingId)}
            >
            Yes (Delete Booking)
            </button>
            <button
                className='cancel-delete' onClick={closeModal}
            >No (Keep Booking)</button>
        </div>
    )
}

export default DeleteBookingModal;
