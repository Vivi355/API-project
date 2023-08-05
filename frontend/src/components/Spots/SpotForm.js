import { useEffect, useState, useCallback } from "react";
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
    const sessionUser = useSelector(state => state.session.user)

    const validateForm = useCallback(() => {
      const errors = {};

      if (!country || country.length < 3 || country.length > 50) errors.country = 'Country is required between 3 and 50 characters';
        if (!address || address.length > 50) errors.address = 'Address is required within 50 characters';
        if (!city || city.length < 2 || city.length > 50) errors.city = 'City is required between 2 and 50 characters';

        if (!state || state.length < 2 || state.length > 50) errors.state = 'State is required between 2 and 50 characters';
        if (!lat || isNaN(lat) || lat < -90 || lat > 90) errors.lat = 'Latitude must a number between -90 and 90';
        if (!lng || isNaN(lng) || lng < -180 || lng > 180) errors.lng = 'Longitude must be a number between -180 and 180';
        if (!description || description.length < 30 || description.length > 1000)
          errors.description = 'Description needs a minimum of 30 characters';
        if (!name || name.length < 3 || name.length > 50) errors.name = 'Name is required between 3 and 50 characters';
        if (!price || isNaN(price)) errors.price = 'Price per day is required';

        if (formType === 'Create a New Spot') {
          if (!previewImage) {
            errors.previewImage = 'Preview Image is required'
          } else {
            try {
              new URL(previewImage);
            } catch(_) {
              errors.previewImage = 'Invalid URL'
            }
          }
        }
        // if (formType === 'Create a new Spot' && !previewImage) errors.previewImage = 'Preview Image is required';

        if (img1 && !img1.endsWith('.png') && !img1.endsWith('.jpg') && !img1.endsWith('.jpeg')) {
            errors.img1 = 'Image URL must end with .png, .jpg, or .jpeg';
          }

        if (img2 && !img2.endsWith('.png') && !img2.endsWith('.jpg') && !img2.endsWith('.jpeg')) {
            errors.img2 = 'Image URL must end with .png, .jpg, or .jpeg';
        }

        if (img3 && !img3.endsWith('.png') && !img3.endsWith('.jpg') && !img3.endsWith('.jpeg')) {
          errors.img3 = 'Image URL must end with .png, .jpg, or .jpeg';
        }

        if (img4 && !img4.endsWith('.png') && !img4.endsWith('.jpg') && !img4.endsWith('.jpeg')) {
          errors.img4 = 'Image URL must end with .png, .jpg, or .jpeg';
      }

        return errors;
    }, [country, address, city, state, lat, lng, description, name, price, previewImage, img1, img2, img3, img4, formType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // need form validation before submit, errors in the obj, return the errors
        let errors = validateForm();
        if (Object.keys(errors).length !== 0) {
          setErrors(errors);
          return;
        }

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

      const images = [
        { url: previewImage, preview: true },
        { url: img1, preview: false },
        { url: img2, preview: false },
        { url: img3, preview: false },
        { url: img4, preview: false },
    ];

      let updatedSpot;
      if (formType === 'Create a New Spot') {
        updatedSpot = await dispatch(createSpotThunk(newSpot, images));
        if (updatedSpot.errors) {
          setErrors(updatedSpot.errors);
        } else {
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

      useEffect(() => {
        setErrors(validateForm());
      }, [country, address, city, state, lat, lng, description, name, price, previewImage, img1, validateForm])

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

                <div id="side-side">
                  <div className="city-field">
                  City
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                  />
                  {errors.city && <p className="error">{errors.city}</p>}
                  </div>
                  <div className="comma"> , </div>

                  <div className="state-field">
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
                </div>

                  {/* <div style={{display: 'flex', justifyContent: "space-be"}}> */}
                <div id="side-side">
                  <div className="">
                  Latitude
                  <input
                    type="number"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Latitude"
                    required
                  />
                  {errors.lat && <p className="error">{errors.lat}</p>}
                  </div>
                  <div className="comma">,</div>
                  <div>
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
                </div>

              </div>

              <div className="description-box">
                <div>
                  <h3>Describe your place to guests</h3>
                  <p>
                  Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
                  </p>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please write at least 30 characters"
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
                {errors.img2 && <p className="error">{errors.img2}</p>}
            </div>
            <div>
                <input
                type="text"
                id="img3"
                value={img3}
                onChange={(e) => setImg3(e.target.value)}
                placeholder="Image URL"
                />
                {errors.img3 && <p className="error">{errors.img3}</p>}
            </div>
            <div>
                <input
                type="text"
                id="img4"
                value={img4}
                onChange={(e) => setImg4(e.target.value)}
                placeholder="Image URL"
                />
                {errors.img4 && <p className="error">{errors.img4}</p>}
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
