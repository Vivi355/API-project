import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Switch, Route } from "react-router-dom";
// import LoginFormPage from "./components/LoginFormPage";
// import SignupFormPage from "./components/SignupFormPage";

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

// Routes
import SpotIndex from "./components/Spots/SpotIndex";
import SpotShow from "./components/Spots/SpotShow";
import CreateSpotForm from "./components/Spots/CreateSpotForm";
import UserSpots from "./components/Spots/UserSpots";
import EditSpotForm from "./components/Spots/EditSpotForm";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          {/* <Route path="/login">
            <LoginFormPage />
          </Route> */}
          {/* <Route path="/signup">
            <SignupFormPage /> */}
          {/* </Route> */}
          <Route exact path='/'component={SpotIndex} />
          <Route path='/spots/new' component={CreateSpotForm} />
          <Route path='/spots/current' component={UserSpots}/>
          <Route path='/spots/:spotId/edit' component={EditSpotForm} />
          <Route path='/spots/:spotId' component={SpotShow}/>
          <Route>Page not Found</Route>
        </Switch>
      )}
    </>
  );
}

export default App;
