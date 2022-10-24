import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './index.css';

function ExploreDrinks() {
  const history = useHistory();

  const changeToAleatoryDrink = async () => {
    const URL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
    const response = await fetch(URL);
    const data = await response.json();
    const infoDrink = data.drinks;
    return infoDrink.map(({ idDrink }) => history.push(`/drinks/${idDrink}`));
  };

  return (
    <div className="exDrinks-container">
      <Header
        headerTitle="Explore Drinks"
        isSearchVisible={ false }
      />
      <div className="exDrinks-buttons">
        <button
          type="button"
          className="drink-by-ingredient"
          data-testid="explore-by-ingredient"
          onClick={ () => history.push('/explore/drinks/ingredients') }
        >
          By Ingredient
        </button>
        <button
          type="button"
          className="surprise-buttom-drink"
          data-testid="explore-surprise"
          onClick={ changeToAleatoryDrink }
        >
          Surprise me!
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default ExploreDrinks;
