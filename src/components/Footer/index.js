import React from 'react';
import { useHistory } from 'react-router-dom';
import drinkIcon from '../../images/drinkIcon.svg';
import exploreIcon from '../../images/exploreIcon.svg';
import mealIcon from '../../images/mealIcon.svg';
import './index.css';

function Footer() {
  // fonte para utilização do hook useHistory:
  // https://www.pluralsight.com/guides/using-react-with-the-history-api
  const history = useHistory();

  return (
    <footer data-testid="footer" className="footer_component">
      <button
        className="footer_button"
        type="button"
        onClick={ () => history.push('/drinks') }
      >
        <img
          className="image-footer"
          src={ drinkIcon }
          alt="drinkIcon"
          data-testid="drinks-bottom-btn"
        />
      </button>
      <button
        className="footer_button"
        type="button"
        onClick={ () => history.push('/explore') }
      >
        <img
          className="image-footer"
          src={ exploreIcon }
          alt="exploreIcon"
          data-testid="explore-bottom-btn"
        />
      </button>
      <button
        className="footer_button"
        type="button"
        onClick={ () => history.push('/foods') }
      >
        <img
          className="image-footer"
          src={ mealIcon }
          alt="mealIcon"
          data-testid="food-bottom-btn"
        />
      </button>
    </footer>
  );
}
export default Footer;
