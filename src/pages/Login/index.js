import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import myContext from '../../context/myContext';
import { setLocalStorage } from '../../services/localStorage';
import './index.css';

const PASSWORD_LENGTH = 6;

function Login({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser, setMealsToken, setCocktailsToken } = useContext(myContext);

  const handleChange = ({ target: { name, value } }) => {
    switch (name) {
    case 'email':
      setEmail(value);
      break;
    case 'password':
      setPassword(value);
      break;
    default:
      break;
    }
  };

  const isButtonDisabled = () => !(/\S+@\S+\.\S+/).test(email)
    || (password.length <= PASSWORD_LENGTH);

  const handleClick = () => {
    setLocalStorage('user', { email });
    setLocalStorage('mealsToken', 1);
    setLocalStorage('cocktailsToken', 1);
    setMealsToken(1);
    setCocktailsToken(1);
    setUser({ email });
    history.push('/foods');
  };

  return (
    <div className="App-header">
      <form className="form-login">
        <h1 className="login-title">Login</h1>
        <input
          className="input-login"
          type="email"
          name="email"
          data-testid="email-input"
          autoComplete="off"
          value={ email }
          onChange={ handleChange }
        />
        <input
          className="input-login"
          type="password"
          name="password"
          data-testid="password-input"
          autoComplete="off"
          value={ password }
          onChange={ handleChange }
        />
        <button
          className="button-login"
          type="button"
          data-testid="login-submit-btn"
          disabled={ isButtonDisabled() }
          onClick={ handleClick }
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Login;
