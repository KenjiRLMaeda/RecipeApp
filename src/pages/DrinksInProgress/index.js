import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import fetchAPI from '../../services/fetchAPI';
import shareIcon from '../../images/shareIcon.svg';
import whiteHeartIcon from '../../images/whiteHeartIcon.svg';
import blackHeartIcon from '../../images/blackHeartIcon.svg';
import { getLocalStorage, setLocalStorage } from '../../services/localStorage';
import Checkbox from './Checkbox';

const ingredientsIndexes = [];
const MAXIMUM_INGREDIENTS_INDEX = 20;
for (let index = 1; index <= MAXIMUM_INGREDIENTS_INDEX; index += 1) {
  ingredientsIndexes.push(index);
}
function DrinksInProgress() {
  const [drink, setDrink] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isIngredientsDone, setIsIngredientsDone] = useState(false);
  const { id } = useParams();
  const [usedIngredients, setUsedIngredients] = useState({
    [id]: '',
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
      && inProgressRecipes.cocktails && inProgressRecipes.cocktails[id]) {
      setUsedIngredients(inProgressRecipes.cocktails);
    }
  }, []);

  useEffect(() => {
    const newIngredients = ingredientsIndexes.map((index) => {
      const newIngredient = {
        strIngredient: drink[`strIngredient${index}`],
        strMeasure: drink[`strMeasure${index}`],
      };
      return newIngredient;
    }).filter(({ strIngredient }) => strIngredient !== ''
    && strIngredient !== null && strIngredient !== undefined);
    setIngredients(newIngredients);
    setIsIngredientsDone(true);
  }, [drink]);

  useEffect(() => {
    async function fetchById() {
      const drinkById = await fetchAPI(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`, 'drinks');
      setDrink(drinkById[0]);
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
    const drinkUrl = history.location.pathname;
    const splittedUrl = drinkUrl.split('/in-progress');
    const formatedUrl = `http://localhost:3000${splittedUrl[0]}`;
    copy(formatedUrl);
    setIsCopied(true);
  };
  const handleFavorite = () => {
    const { strAlcoholic, strCategory, strDrink, strDrinkThumb } = drink;
    const favoritedRecipes = localStorage.getItem('favoriteRecipes');
    setIsFavorite(!isFavorite);
    const objToFavorite = {
      id,
      type: 'drink',
      nationality: '',
      category: strCategory,
      alcoholicOrNot: strAlcoholic,
      name: strDrink,
      image: strDrinkThumb,
    };
    if (favoritedRecipes === null) {
      localStorage.setItem('favoriteRecipes', JSON.stringify([objToFavorite]));
    } else if (favoritedRecipes.includes(id)) {
      const favoritesWithoutPresentDrink = JSON.parse(favoritedRecipes)
        .filter((cocktails) => cocktails.id !== id);
      localStorage
        .setItem('favoriteRecipes', JSON.stringify(favoritesWithoutPresentDrink));
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
      setLocalStorage('inProgressRecipes', { cocktails: newIngredient });
    } else if (inProgressRecipes && !inProgressRecipes.cocktails) {
      const newInProgressRecipes = {
        ...inProgressRecipes,
        cocktails: {
          [id]: [target.value],
        },
      };
      newIngredient = {
        [id]: [target.value],
      };
      setUsedIngredients(newIngredient);
      setLocalStorage('inProgressRecipes', newInProgressRecipes);
    } else if (!Object.keys(inProgressRecipes.cocktails).includes(id)) {
      const newInProgressRecipes = {
        ...inProgressRecipes,
        cocktails: {
          ...inProgressRecipes.cocktails,
          [id]: [target.value],
        },
      };
      newIngredient = {
        [id]: [target.value],
      };
      setUsedIngredients(newIngredient);
      setLocalStorage('inProgressRecipes', newInProgressRecipes);
    } else if (!inProgressRecipes.cocktails[id].includes(target.value)) {
      const newInProgressRecipes = {
        ...inProgressRecipes,
        cocktails: {
          ...inProgressRecipes.cocktails,
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
    const { strDrink, strDrinkThumb, strCategory, strInstructions, strAlcoholic } = drink;
    return (
      <div className="recipe_details_component">
        <div key={ strDrink } className="recipe_containter">
          <img
            src={ strDrinkThumb }
            alt="food template"
            data-testid="recipe-photo"
            width="360"
          />
          <div className="recipe_info">
            <h1 data-testid="recipe-title">{strDrink}</h1>
            <h4 data-testid="recipe-category">{`${strCategory} - ${strAlcoholic}`}</h4>
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

export default DrinksInProgress;
