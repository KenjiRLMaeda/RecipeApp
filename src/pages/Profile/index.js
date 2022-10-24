import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getLocalStorage } from '../../services/localStorage';
import './index.css';

function Profile() {
  const history = useHistory();
  const user = getLocalStorage('user');
  const email = user ? user.email : '';

  const handleLogout = () => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="profile_container">
      <Header
        headerTitle="Profile"
        isSearchVisible={ false }
      />
      <div>
        <h3>User: </h3>
        <h3 data-testid="profile-email">
          {email}
        </h3>
        <button
          type="button"
          className="profile-buttom"
          data-testid="profile-done-btn"
          onClick={ () => history.push('/done-recipes') }
        >
          Done Recipes
        </button>
        <button
          type="button"
          className="profile-buttom"
          data-testid="profile-favorite-btn"
          onClick={ () => history.push('/favorite-recipes') }
        >
          Favorite Recipes
        </button>
        <button
          type="button"
          className="profile-buttom"
          data-testid="profile-logout-btn"
          onClick={ () => handleLogout() }
        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
