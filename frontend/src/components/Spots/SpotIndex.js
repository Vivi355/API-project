import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Spots.css";
import { fetchSpots } from "../../store/spots"; // thunk
import SpotIndexItem from "./SpotIndexItem";

const SpotIndex = () => {
    const dispatch = useDispatch();

    const allSpots = useSelector((state) => state.spots.allSpots);
    // console.log('spotIndex:', allSpots);

    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch]);

    // if (!allSpots) return null;
    // console.log('allspots', allSpots);
    if (!allSpots || Object.keys(allSpots).length === 0) return null;

    return (
        <section>
            <ul>
            {Object.values(allSpots).map(spot => (
                <SpotIndexItem
                    spot={spot}
                    key={spot.id}
                />
             ))}
            </ul>
        </section>
    )
}

export default SpotIndex;
