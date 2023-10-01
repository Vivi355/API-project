import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchBookings } from "../../store/bookings";
import './UserBookings.css'
import DeleteBookingModal from "../DeleteBookingModal";
import { useModal } from "../../context/Modal";


const UserBookings = () => {
    const dispatch = useDispatch();
    const {openModal} = useModal();

    const bookingsMap = useSelector(state => state.bookings.bookings);
    const bookingsArray = Object.values(bookingsMap);
    const [dateLoaded, setDataLoaded] = useState(false)

    useEffect(() => {
        dispatch(fetchBookings()).then(() => {
            setDataLoaded(true)
            // console.log(bookingsArray);
        });
    }, [dispatch])

    // delete booking modal
    const deleteClick = (bookingId) => {
        openModal(<DeleteBookingModal bookingId={bookingId} />)
        dispatch(fetchBookings())
    }

    if (!dateLoaded) return null;
    if (!bookingsArray.length) return <div>No bookings available.</div>;

    return (
        <div id="manage-bookings-page">
            <div className="title">
                <h2>Manage Bookings</h2>
            </div>
            <div className="booking-list">
                {bookingsArray.map(booking => (
                    <div key={booking.id} className="booking-entry">
                        <div className="left-spot">
                            <NavLink to={`/spots/${booking.Spot?.id}`}>
                                <img src={booking.Spot?.previewImage} alt="Spot Preview Image"/>
                                <div className="bAdd">{booking.Spot?.address}, {booking.Spot?.city}</div>
                                <div className="bPrice">${booking.Spot?.price}/night</div>
                            </NavLink>
                        </div>
                        <div className="booking-right">
                            <div>Booking: {booking.Spot?.name}</div>
                            <div>Start Date: {booking.startDate}</div>
                            <div>End Date: {booking.endDate}</div>

                        </div>
                        <div className="b-delete">
                            <button onClick={() => deleteClick(booking.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserBookings
