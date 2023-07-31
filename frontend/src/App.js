import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Switch, Route } from "react-router-dom";
// import LoginFormPage from "./components/LoginFormPage";
// import SignupFormPage from "./components/SignupFormPage";

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/Spots/SpotIndex";
import SpotShow from "./components/Spots/SpotShow";
// import SpotForm from "./components/Spots/SpotForm";
import CreateSpotForm from "./components/Spots/CreateSpotForm";


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
          <Route path='/spots/:spotId' component={SpotShow}/>
        </Switch>
      )}
    </>
  );
}

export default App;
