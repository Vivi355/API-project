import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./SpotForm.css";
import { createSpotThunk, updateSpotThunk } from "../../store/spots";


const SpotForm = ({spot, formType}) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [country, setCountry] = useState(spot?.country || '');
    const [address, setAddress] = useState(spot?.address || '');
    const [city, setCity] = useState(spot?.city || '');
    const [state, setState] = useState(spot?.state || '');
    const [lat, setLat] = useState(spot?.lat || '');
    const [lng, setLng] = useState(spot?.lng || '');
    const [description, setDescription] = useState(spot?.description || '');
    const [name, setName] = useState(spot?.name || '');
    const [price, setPrice] = useState(spot?.price || '');

    // New state for the image URLs
    const [previewImage, setPreviewImage] = useState('');
    const [img1, setImg1] = useState('');
    const [img2, setImg2] = useState('');
    const [img3, setImg3] = useState('');
    const [img4, setImg4] = useState('');


    const [errors, setErrors] = useState({});
    // const [formSubmitted, setFormSubitted] = useState(false)
    const sessionUser = useSelector(state => state.session.user)


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log('handle submit function called');

        // need form validation before submit, errors in the obj, return the errors
        let errors = validateForm();
        if (Object.keys(errors).length !== 0) {
          setErrors(errors);
          return;
        }

        // console.log('Creating new Spot obj');
        const newSpot = {
          // ...spot,
          country,
          address,
          city,
          state,
          lat: Number(lat),
          lng: Number(lng),
          description,
          name,
          price: Number(price),
          userId: sessionUser.id,
      };

      // console.log('creating image array');
      const images = [
        { url: previewImage, preview: true },
        { url: img1, preview: false },
        { url: img2, preview: false },
        { url: img3, preview: false },
        { url: img4, preview: false },
    ];

      let updatedSpot;
      if (formType === 'Create a new Spot') {
        // console.log('before created spot thunk call ');
        updatedSpot = await dispatch(createSpotThunk(newSpot, images));
        // console.log('after create spot thunk call');
        // spot = createdSpot;
        if (updatedSpot.errors) {
          // There were errors, so update state with these errors
          setErrors(updatedSpot.errors);
        } else {
          // No errors, so it must have been successful
          // spot = createdSpot;
          // console.log('before history push');
          history.push(`/spots/${updatedSpot.id}`);
        }
      } else if (formType === 'Update your Spot') {
        updatedSpot = await dispatch(updateSpotThunk({...newSpot, id: spot.id}, images));
        if (updatedSpot.errors) {
          setErrors(updatedSpot.errors);
        } else {
          history.push(`/spots/${updatedSpot.id}`)
        }
      }
};

      // Function to validate the form data (you can modify this based on your validation requirements)
      function validateForm() {
        const errors = {};

        if (!country || country.length < 3) errors.country = 'Country is required between 3 and 50 characters';
        if (!address) errors.address = 'Address is required';
        if (!city || city.length < 2) errors.city = 'City is required with min of 2 characters';
        if (!state || state.length < 2) errors.state = 'State is required with min of 2 characters';
        if (!lat || isNaN(lat) || lat < -90 || lat > 90) errors.lat = 'Latitude must a number between -90 and 90';
        if (!lng || isNaN(lng) || lng < -180 || lng > 180) errors.lng = 'Longitude must be a number between -180 and 180';
        if (!description || description.length < 30)
          errors.description = 'Description needs a minimum of 30 characters';
        if (!name || name.length < 3) errors.name = 'Name is required between 3 and 50 characters';
        if (!price || isNaN(price)) errors.price = 'Price per day is required';

        if (!previewImage) errors.previewImage = 'Preview Image is required';

        if (img1 && !img1.endsWith('.png') && !img1.endsWith('.jpg') && !img1.endsWith('.jpeg')) {
            errors.img1 = 'Image URL must end with .png, .jpg, or .jpeg';
          }


        return errors;
      };

      useEffect(() => {
        setErrors(validateForm());
      }, [country, address, city, state, lat, lng, description, name, price, previewImage, img1])

        return (
          <div id="create-spot-form-container">
            <form onSubmit={handleSubmit}>
              <div className="title-form">
                <p>{formType}</p>
                <h3>Where's your place located?</h3>
              </div>
              <p>Guests will only get your exact address once they booked a reservation.</p>

              <div className="address">
                <div>
                  Country
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    required
                  />
                  {errors.country && <p className="error">{errors.country}</p>}
                </div>
                <div>
                  Street Address
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    required
                  />
                  {errors.address && <p className="error">{errors.address}</p>}
                </div>

                <div className="side-side">
                  City
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                  />
                  {errors.city && <p className="error">{errors.city}</p>}
                  State
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="STATE"
                    required
                  />
                  {errors.state && <p className="error">{errors.state}</p>}
                  </div>

                  {/* <div style={{display: 'flex', justifyContent: "space-be"}}> */}
                  Latitude
                  <input
                    type="number"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Latitude"
                    required
                  />
                  {errors.lat && <p className="error">{errors.lat}</p>}
                  Longitude
                  <input
                    type="number"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="Longitude"
                    required
                  />
                  {errors.lng && <p className="error">{errors.lng}</p>}


              </div>

              <div className="description-box">
                <div>
                  <h3>Describe your place to guests</h3>
                  <p>
            Mention the best features of your space, only special amenities
            like fast wifi or parking, and what you love about the
            neighborhood.
          </p>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div className="spotName-section">
        <div>
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what
            makes your place special.
          </p>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name of your spot"
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="price-section">
        <div>
          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
        </div>
        $<input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price per night (USD)"
          required
        />
        {errors.price && <p className="error">{errors.price}</p>}
      </div>

      <div className="urls-section">
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot</p>

          <div className="urls-input">
            <div>
            <input
                type="text"
                id="previewImage"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                placeholder="Preview Image URL"
                />
                {errors.previewImage && <p className="error">{errors.previewImage}</p>}
            </div>

            <div>
                <input
                type="text"
                id="img1"
                value={img1}
                onChange={(e) => setImg1(e.target.value)}
                placeholder="Image URL"
                />
                {errors.img1 && <p className="error">{errors.img1}</p>}
            </div>
            <div>
                <input
                type="text"
                id="img2"
                value={img2}
                onChange={(e) => setImg2(e.target.value)}
                placeholder="Image URL"
                />
            </div>
            <div>
                <input
                type="text"
                id="img3"
                value={img3}
                onChange={(e) => setImg3(e.target.value)}
                placeholder="Image URL"
                />
            </div>
            <div>
                <input
                type="text"
                id="img4"
                value={img4}
                onChange={(e) => setImg4(e.target.value)}
                placeholder="Image URL"
                />
            </div>
          </div>
      </div>

      <div className="create-spot-button">
        <button type="submit">{formType}</button>
      </div>

    </form>
    </div>
  );
};



export default SpotForm;