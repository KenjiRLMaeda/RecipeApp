import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import fetchAPI from '../../services/fetchAPI';
import RecipeCard from '../../components/RecipeCard';

function ExFoodsNationalities() {
  const [nationalities, setNationalities] = useState([]);
  const [foodsCard, setFoodsCard] = useState([]);

  const MAXIMUM_RENDER = '12';

  // Fetch para buscar todas as nacionalidades do dropdown.
  useEffect(() => {
    async function fetchNationalities() {
      const URL = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
      const nationalitiesTypes = await fetchAPI(URL, 'meals');
      setNationalities(nationalitiesTypes);
    }
    fetchNationalities();
  }, []);

  // Fetch API para renderizar cards.
  useEffect(() => {
    async function fetchFoods() {
      const URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      const foodsInfo = await fetchAPI(URL, 'meals');
      setFoodsCard(foodsInfo);
    }
    fetchFoods();
  }, []);

  // Fetch para buscar cards por nacionalidade selecionada
  async function fetchNationalitiesCards(value) {
    const URL = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${value}`;
    const nationalitieCards = await fetchAPI(URL, 'meals');
    setFoodsCard(nationalitieCards);
  }

  const handleChange = async ({ target: { value } }) => {
    if (value === 'All') {
      const foodsInfo = await fetchAPI('https://www.themealdb.com/api/json/v1/1/search.php?s=', 'meals');
      setFoodsCard(foodsInfo);
    } else {
      fetchNationalitiesCards(value);
    }
  };

  return (
    <div>
      <Header headerTitle="Explore Nationalities" />
      <select
        data-testid="explore-by-nationality-dropdown"
        onChange={ handleChange }
      >
        <option value="All" data-testid="All-option">All</option>
        {
          nationalities.length > 1 && nationalities
            .map(({ strArea }) => (
              <option
                data-testid={ `${strArea}-option` }
                key={ strArea }
                value={ strArea }
              >
                { strArea }
              </option>
            ))
        }
      </select>
      <div className="recipes-container">
        {
          foodsCard && foodsCard
            .filter((_, index) => index < MAXIMUM_RENDER)
            .map((recipe, index) => (
              <RecipeCard
                key={ recipe.idMeal }
                recipe={ recipe }
                index={ index }
                type="Meal"
              />
            ))
        }
      </div>
      <Footer />
    </div>
  );
}

export default ExFoodsNationalities;
