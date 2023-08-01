import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpot.css';
import { deleteSpot, loadCurrentUserSpot } from '../../store/spots';

function DeleteSpotModal ({spotId})   {
    const dispatch = useDispatch();
    const {closeModal} = useModal(); // consume context

    const handleDelete = async(spotId) => {
        // e.preventDefault();
        // dispatch(deleteSpot(spotId))
        // .then(closeModal).catch((res) => {
        //     console.error(res);
        // })

        await dispatch(deleteSpot(spotId));
        closeModal();
        // refetch spots for current user
        dispatch(loadCurrentUserSpot());
    }

    return (
        <div className='delete-popup'>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>

            <button
                className='delete-button'
                onClick={() => handleDelete(spotId)}
            >
            Yes (Delete Spot)
            </button>
            <button
                className='cancel-delete' onClick={closeModal}
            >No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal;
