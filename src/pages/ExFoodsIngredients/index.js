import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import fetchAPI from '../../services/fetchAPI';
import myContext from '../../context/myContext';
import IngredientCard from '../../components/IngredientCard';

const MAXIMUM_RENDER = 12;

function ExFoodsIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const { setSearch } = useContext(myContext);
  const history = useHistory();
  useEffect(() => {
    async function fetchDrinkApi() {
      const exploreFoodsByIngredients = await fetchAPI('https://www.themealdb.com/api/json/v1/1/list.php?i=list', 'meals');
      setIngredients(exploreFoodsByIngredients);
    }
    fetchDrinkApi();
  }, []);

  const handleClick = (ingredientName) => {
    setSearch({ input: ingredientName, type: 'ingredient' });
    history.push('/foods');
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
          .map(({ strIngredient }, index) => (
            <IngredientCard
              key={ index }
              handleClick={ handleClick }
              name={ strIngredient }
              api="meal"
              index={ index }
            />
          ))}
      </div>
      <Footer />
    </div>
  );
}

export default ExFoodsIngredients;
