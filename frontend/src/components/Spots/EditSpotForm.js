import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { spotDetailThunk } from "../../store/spots";
import SpotForm from './SpotForm';

const EditSpotForm = () => {
    const {spotId} = useParams();

    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot);
    console.log(spot);
    // const state = useSelector(state => state)
    // console.log('state in editSpotForm', state);

    useEffect(() => {
        dispatch(spotDetailThunk(spotId));
    }, [dispatch, spotId]);

    // console.log(spot);
    return (
        spot && Object.keys(spot).length > 1 && (
            <>
                <SpotForm
                    spot={spot}
                    formType="Update your Spot"
                />
            </>
        )
    )
}

export default EditSpotForm;
