import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import myContext from './myContext';
import { getLocalStorage } from '../services/localStorage';

function MyProvider({ children }) {
  const [user, setUser] = useState({ email: '' });
  const [mealsToken, setMealsToken] = useState('');
  const [cocktailsToken, setCocktailsToken] = useState('');
  const [search, setSearch] = useState({ input: '', type: 'name' });

  useEffect(() => {
    const localStorageUser = getLocalStorage('user');
    if (localStorageUser && user.email === '') {
      setUser(localStorageUser);
    }
  }, [user]);

  const context = {
    user,
    setUser,
    mealsToken,
    cocktailsToken,
    search,
    setSearch,
    setMealsToken,
    setCocktailsToken,
  };

  return (
    <myContext.Provider value={ context }>
      {children}
    </myContext.Provider>
  );
}

MyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MyProvider;
