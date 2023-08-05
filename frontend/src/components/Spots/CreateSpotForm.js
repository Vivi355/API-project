import React from 'react';
import SpotForm from "./SpotForm";

const CreateSpotForm = () => {
    const spot = {
      country: '',
      address: '',
      city: '',
      state: '',
      lat: '',
      lng: '',
      description: '',
      name: '',
      price: '',
      previewImage: '',
      img1: '',
      img2: '',
      img3: '',
      img4: ''
    };

    return (
      <SpotForm
        spot={spot}
        formType="Create a New Spot"
      />
    );
  };

export default CreateSpotForm;
