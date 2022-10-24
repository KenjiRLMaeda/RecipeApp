import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import fetchAPI from '../../services/fetchAPI';
import myContext from '../../context/myContext';
import IngredientCard from '../../components/IngredientCard';

const MAXIMUM_RENDER = 12;

function ExDrinksIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const { setSearch } = useContext(myContext);
  const history = useHistory();
  useEffect(() => {
    async function fetchDrinkApi() {
      const exploreDrinksByIngredients = await fetchAPI('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list', 'drinks');
      setIngredients(exploreDrinksByIngredients);
    }
    fetchDrinkApi();
  }, []);

  const handleClick = (ingredientName) => {
    setSearch({ input: ingredientName, type: 'ingredient' });
    history.push('/drinks');
  };
  return (
    <div>
      <Header
        headerTitle="Explore Ingredients"
        isSearchVisible={ false }
      />
      <div className="ingredients-container">
        {ingredients.length > 1 && ingredients
          .filter((_, index) => index < MAXIMUM_RENDER)
          .map(({ strIngredient1 }, index) => (
            <IngredientCard
              key={ index }
              handleClick={ handleClick }
              name={ strIngredient1 }
              api="cocktail"
              index={ index }
            />
          ))}
      </div>
      <Footer />
    </div>
  );
}

export default ExDrinksIngredients;
