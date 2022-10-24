import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './index.css';

function ExploreFoods() {
  const history = useHistory();

  const changeToAleatoryFood = async () => {
    const URL = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const response = await fetch(URL);
    const data = await response.json();
    const infoFood = data.meals;
    return infoFood.map(({ idMeal }) => history.push(`/foods/${idMeal}`));
  };

  return (
    <div className="exFoods-container">
      <Header
        headerTitle="Explore Foods"
        isSearchVisible={ false }
      />
      <div className="exFoods-buttons">
        <button
          type="button"
          className="by-ingredient"
          data-testid="explore-by-ingredient"
          onClick={ () => history.push('/explore/foods/ingredients') }
        >
          By Ingredient
        </button>
        <button
          type="button"
          className="by-nationality"
          data-testid="explore-by-nationality"
          onClick={ () => history.push('/explore/foods/nationalities') }
        >
          By Nationality
        </button>
        <button
          type="button"
          className="surprise-buttom"
          data-testid="explore-surprise"
          onClick={ changeToAleatoryFood }
        >
          Surprise me!
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default ExploreFoods;
