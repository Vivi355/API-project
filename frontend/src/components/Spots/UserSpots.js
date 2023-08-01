import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./UserSpots.css"
import { loadCurrentUserSpot } from "../../store/spots";
import SpotIndexItem from "./SpotIndexItem";
import DeleteSpotModal from "../DeleteSpotModal";

const UserSpots = () => {
    const {openModal} = useModal();
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spots.userSpots);

    useEffect(() => {
        dispatch(loadCurrentUserSpot());
    }, [dispatch]);

    // delete modal
    const deleteClick = (spotId) => {
        openModal(<DeleteSpotModal spotId={spotId} />);
    }

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
                            <button
                                onClick={() => deleteClick(spot.id)}>Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserSpots;
