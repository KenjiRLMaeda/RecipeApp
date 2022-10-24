import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './index.css';

function Explore() {
  const history = useHistory();

  return (
    <div className="explore-container">
      <Header
        isSearchVisible={ false }
        headerTitle="Explore"
      />
      <div className="buttons-explore">
        <button
          className="button-exFoods"
          type="button"
          data-testid="explore-foods"
          onClick={ () => history.push('/explore/foods') }
        >
          Explore Foods
        </button>
        <button
          className="button-exDrinks"
          type="button"
          data-testid="explore-drinks"
          onClick={ () => history.push('/explore/drinks') }
        >
          Explore Drinks
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Explore;
