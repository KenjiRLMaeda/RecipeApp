import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import fetchAPI from '../../services/fetchAPI';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import './index.css';
import { getLocalStorage, setLocalStorage } from '../../services/localStorage';
import Checkbox from './Checkbox';

const ingredientsIndexes = [];
const MAXIMUM_INGREDIENTS_INDEX = 20;
for (let index = 1; index <= MAXIMUM_INGREDIENTS_INDEX; index += 1) {
  ingredientsIndexes.push(index);
}
function FoodsInProgress() {
  const [meal, setMeal] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isIngredientsDone, setIsIngredientsDone] = useState(false);
  const { id } = useParams();
  const [usedIngredients, setUsedIngredients] = useState({
    [id]: [],
  });
  const history = useHistory();

  const checkIngredients = () => {
    const checkboxes = document.querySelectorAll('input');
    const checksFromCheckboxes = [];
    checkboxes.forEach((checkbox) => checksFromCheckboxes.push(checkbox.checked));
    if (checksFromCheckboxes.length) {
      const isEveryCheckboxChecked = checksFromCheckboxes
        .every((checkbox) => checkbox);
      return isEveryCheckboxChecked;
    }
  };

  useEffect(() => {
    const inProgressRecipes = getLocalStorage('inProgressRecipes');
    if (inProgressRecipes
      && inProgressRecipes.meals && inProgressRecipes.meals[id]) {
      setUsedIngredients(inProgressRecipes.meals);
    }
  }, []);

  useEffect(() => {
    if (meal.strMeal) {
      const newIngredients = ingredientsIndexes.map((index) => {
        const newIngredient = {
          strIngredient: meal[`strIngredient${index}`],
          strMeasure: meal[`strMeasure${index}`],
        };
        return newIngredient;
      }).filter(({ strIngredient }) => strIngredient !== '' && strIngredient !== null);
      setIngredients(newIngredients);
      setIsIngredientsDone(true);
    }
  }, [meal]);

  useEffect(() => {
    async function fetchById() {
      const mealById = await fetchAPI(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, 'meals');
      setMeal(mealById[0]);
    }
    fetchById();
  }, [id]);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes) {
      const isRecipeFavorited = favoriteRecipes.some((recipe) => +recipe.id === +id);
      if (isRecipeFavorited) {
        setIsFavorite(true);
      }
    }
  }, [id]);

  const handleShare = () => {
    const mealUrl = history.location.pathname;
    const splittedUrl = mealUrl.split('/in-progress');
    const formatedUrl = `http://localhost:3000${splittedUrl[0]}`;
    copy(formatedUrl);
    setIsCopied(true);
  };

  const handleFavorite = () => {
    const { strArea, strCategory, strMeal, strMealThumb } = meal;
    const favoritedRecipes = localStorage.getItem('favoriteRecipes');
    setIsFavorite(!isFavorite);
    const objToFavorite = {
      id,
      type: 'food',
      nationality: strArea,
      category: strCategory,
      alcoholicOrNot: '',
      name: strMeal,
      image: strMealThumb,
    };
    if (favoritedRecipes === null) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([objToFavorite]));
    } else if (favoritedRecipes.includes(id)) {
      const favoritesWithoutPresentFood = JSON.parse(favoritedRecipes)
        .filter((food) => food.id !== id);
      localStorage
        .setItem('favoriteRecipes', JSON.stringify(favoritesWithoutPresentFood));
    } else {
      localStorage.setItem(
        'favoriteRecipes',
        JSON.stringify([
          ...JSON.parse(favoritedRecipes),
          objToFavorite,
        ]),
      );
    }
  };
  const handleIngredientClick = (target) => {
    target.parentElement.className = 'ingredient-is-done';
    const inProgressRecipes = getLocalStorage('inProgressRecipes');
    let newIngredient = {};
    if (inProgressRecipes === null) {
      newIngredient = {
        [id]: [target.value],
      };
      setUsedIngredients(newIngredient);
      setLocalStorage('inProgressRecipes', { meals: newIngredient });
    } else if (inProgressRecipes && !inProgressRecipes.meals) {
      const newInProgressRecipes = {
        ...inProgressRecipes,
        meals: {
          [id]: [target.value],
        },
      };
      newIngredient = {
        [id]: [target.value],
      };
      setUsedIngredients(newIngredient);
      setLocalStorage('inProgressRecipes', newInProgressRecipes);
    } else if (inProgressRecipes.meals
      && !Object.keys(inProgressRecipes.meals).includes(id)) {
      const newInProgressRecipes = {
        ...inProgressRecipes,
        meals: {
          ...inProgressRecipes.meals,
          [id]: [target.value],
        },
      };
      newIngredient = {
        [id]: [target.value],
      };
      setUsedIngredients(newIngredient);
      setLocalStorage('inProgressRecipes', newInProgressRecipes.meals[id]);
    } else if (inProgressRecipes.meals
      && !inProgressRecipes.meals[id].includes(target.value)) {
      const newInProgressRecipes = {
        ...inProgressRecipes,
        meals: {
          ...inProgressRecipes.meals,
          [id]: [...Object.values(usedIngredients[id]), target.value],
        },
      };
      setLocalStorage('inProgressRecipes', newInProgressRecipes);
      newIngredient = {
        [id]: [...Object.values(usedIngredients[id]), target.value],
      };
      setUsedIngredients(newIngredient);
    }
  };

  const renderDetails = () => {
    const { strMeal, strMealThumb, strCategory, strInstructions } = meal;
    return (
      <div className="recipe_details_component">
        <div key={ strMeal } className="recipe_containter">
          <img
            src={ strMealThumb }
            alt="food template"
            data-testid="recipe-photo"
            width="360"
          />
          <div className="recipe_info">
            <h1 data-testid="recipe-title">{strMeal}</h1>
            <h4 data-testid="recipe-category">{strCategory}</h4>
            <button
              type="button"
              onClick={ () => handleShare() }
            >
              <img src={ shareIcon } alt="Share Icon" data-testid="share-btn" />
            </button>
            {isCopied && <p>Link copied!</p>}
            <button
              type="button"
              className="favorite_btn"
              onClick={ handleFavorite }
            >
              {isFavorite ? (
                <img
                  src={ blackHeartIcon }
                  alt="Favorite Icon"
                  data-testid="favorite-btn"
                />)
                : (
                  <img
                    src={ whiteHeartIcon }
                    alt="Favorite Icon"
                    data-testid="favorite-btn"
                  />)}
            </button>
          </div>
        </div>
        <div className="recipe_follow_up">
          <h2>Ingredients</h2>
          {ingredients
            .map(({ strIngredient, strMeasure }, index) => (
              <Checkbox
                key={ index }
                index={ index }
                ingredient={ strIngredient }
                measure={ strMeasure }
                id={ id }
                handleIngredientClick={ handleIngredientClick }
                usedIngredients={ usedIngredients }
                setUsedIngredients={ setUsedIngredients }
              />
            ))}
          <p data-testid="instructions">
            {strInstructions}
          </p>
        </div>
        <button
          type="button"
          disabled={ !checkIngredients() }
          data-testid="finish-recipe-btn"
          onClick={ () => history.push('/done-recipes') }
        >
          Finish Recipe
        </button>
      </div>
    );
  };

  return (
    <main>
      {isIngredientsDone && renderDetails()}
    </main>
  );
}

export default FoodsInProgress;
