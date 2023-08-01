import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./UserSpots.css"
import { loadCurrentUserSpot } from "../../store/spots";
import SpotIndexItem from "./SpotIndexItem";

const UserSpots = () => {
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spots.userSpots);

    useEffect(() => {
        dispatch(loadCurrentUserSpot());
    }, [dispatch]);

    return (
        <div id="manage-spots-page">
            <div className="title-box">
                <h2>Manage Spots</h2>
                <Link to="/spots/new">
                    <button>Create a New Spot</button>
                </Link>
            </div>

            <div className="spot-list">
                {userSpots && userSpots.map((spot) =>
                    <div className="single-spot" key={spot.id}>
                        <SpotIndexItem spot={spot} />
                        <div className="update-delete-buttons">
                            <Link to={`/spots/${spot.id}/edit`}>
                                <button>Update</button>
                            </Link>
                            <button>Delete</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserSpots;
