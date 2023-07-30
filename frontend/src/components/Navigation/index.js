
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className='navgation-container'>
      <li className='logo'>
        <NavLink exact to="/">
          <div className='left-nav'>
            <i className="fa-brands fa-airbnb fa-rotate-180 fa-2xl"></i>
            <div className='site-name'>
              staycali
            </div>
          </div>
        </NavLink>
      </li>
      {isLoaded && (
        <div className='user-button'>
          <div>
            <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}
    </ul>
  );
}

export default Navigation;
