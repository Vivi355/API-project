import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchBookings } from "../../store/bookings";
import './UserBookings.css'

const UserBookings = () => {
    // console.log('user booking component rendered');
    const dispatch = useDispatch();

    const bookingsMap = useSelector(state => state.bookings.bookings);
    const bookingsArray = Object.values(bookingsMap);

    useEffect(() => {
        dispatch(fetchBookings())
    }, [dispatch])

    if (!bookingsArray.length) return null;

    return (
        <div id="manage-bookings-page">
            <div className="title">
                <h2>Manage Bookings</h2>
            </div>
            <div className="booking-list">
                {bookingsArray.map(booking => (
                    <div key={booking.id} className="booking-entry">
                        <div className="left-spot">
                            <NavLink to={`/spots/${booking.Spot.id}`}>
                                <img src={booking.Spot.previewImage} alt="Spot Preview Image"/>
                                <div className="bAdd">{booking.Spot.address}, {booking.Spot.city}</div>
                                <div className="bPrice">${booking.Spot.price}/night</div>
                            </NavLink>
                        </div>
                        <div className="booking-right">
                            <div>Booking: {booking.Spot.name}</div>
                            <div>Start Date: {booking.startDate}</div>
                            <div>End Date: {booking.endDate}</div>

                        </div>
                        <div className="b-delete">
                            <button>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserBookings
