import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import copy from 'clipboard-copy';
import fetchAPI from '../../services/fetchAPI';
import './index.css';
import ShareButton from '../../components/ShareButton';
import FavoriteButton from '../../components/FavoriteButton';

const ingredientsIndexes = [];
const MAXIMUM_INGREDIENTS_INDEX = 20;
for (let index = 1; index <= MAXIMUM_INGREDIENTS_INDEX; index += 1) {
  ingredientsIndexes.push(index);
}
const MAXIMUM_RECIPES = 6;

function MealRecipeDetails() {
  const [recipes, setRecipes] = useState([]);
  const [meal, setMeal] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  // os valores para o status do recipe são: new recipe, in progress e done
  const [recipeStatus, setRecipeStatus] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const newIngredients = ingredientsIndexes.map((index) => {
      const newIngredient = {
        strIngredient: meal[`strIngredient${index}`],
        strMeasure: meal[`strMeasure${index}`],
      };
      return newIngredient;
    }).filter(({ strIngredient }) => strIngredient !== '' && strIngredient !== null);
    setIngredients(newIngredients);
  }, [meal]);

  // resgata as infos do localStorage para ver o andamento da receita:
  useEffect(() => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    if (!doneRecipes) {
      setRecipeStatus('new recipe');
    }
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (inProgressRecipes && inProgressRecipes.meals) {
      const isRecipeInProgress = inProgressRecipes.meals[id];
      if (isRecipeInProgress) {
        setRecipeStatus('in progress');
      }
    }
    if (doneRecipes) {
      const isRecipeDone = doneRecipes.some((recipe) => +recipe.id === +id);
      if (isRecipeDone) {
        setRecipeStatus('done');
      }
    }
  }, [id]);

  // identifica se a receita é favoritada
  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes) {
      const isRecipeFavorited = favoriteRecipes.some((recipe) => +recipe.id === +id);
      if (isRecipeFavorited) {
        setIsFavorite(true);
      }
    }
  }, [id]);

  useEffect(() => {
    async function fetchCategories() {
      const dataFetched = await fetchAPI('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=', 'drinks');
      setRecipes(dataFetched);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchById() {
      const mealById = await fetchAPI(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, 'meals');
      setMeal(mealById[0]);
    }
    fetchById();
  }, [id]);

  const handleShare = () => {
    const mealUrl = history.location.pathname;
    const formatedUrl = `http://localhost:3000${mealUrl}`;
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
      // cria a chave caso ainda não exista
      localStorage.setItem('favoriteRecipes', JSON.stringify([objToFavorite]));
    } else if (favoritedRecipes.includes(id)) {
      // lógica para desfavoritar uma comida
      const favoritesWithoutPresentFood = JSON.parse(favoritedRecipes)
        .filter((food) => food.id !== id);
      localStorage
        .setItem('favoriteRecipes', JSON.stringify(favoritesWithoutPresentFood));
    } else {
      // existindo a chave, acrescenta os elementos já existentes + o novo
      localStorage.setItem(
        'favoriteRecipes',
        JSON.stringify([
          ...JSON.parse(favoritedRecipes),
          objToFavorite,
        ]),
      );
    }
  };

  const renderDetails = () => {
    const { strMeal, strMealThumb, strCategory, strInstructions, strYoutube } = meal;
    const splittedVideo = strYoutube.split('watch?v=');
    const embededVideo = `${splittedVideo[0]}embed/${splittedVideo[1]}`;
    return (
      <div className="recipe_details_component">
        <img
          src={ strMealThumb }
          alt="food template"
          data-testid="recipe-photo"
          width="360"
          className="recipe_thumb"
        />
        <div key={ strMeal } className="recipe_container">
          <div className="recipe_info">
            <h1 data-testid="recipe-title">{strMeal}</h1>
            <h4 data-testid="recipe-category">{`| ${strCategory}`}</h4>
          </div>
          <div className="share_and_favorite_btn">
            <FavoriteButton
              handleFavorite={ handleFavorite }
              isFavorite={ isFavorite }
            />
            <ShareButton
              handleShare={ handleShare }
            />
            {isCopied && <p>Link copied!</p>}

          </div>
          <div className="recipe_follow_up">
            <h4>Ingredients</h4>
            <ul className="recipe_ingredients">
              {ingredients
                .map(({ strIngredient, strMeasure }, index) => (
                  <li
                    key={ index }
                    data-testid={ `${index}-ingredient-name-and-measure` }
                  >
                    {`${strIngredient} - ${strMeasure}`}
                  </li>
                ))}
            </ul>
            <h4>Instructions</h4>
            <p data-testid="instructions">
              {strInstructions}
            </p>
          </div>
          <iframe
            className="recipe_video"
            width="360"
            height="315"
            src={ embededVideo }
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            data-testid="video"
          />
          <div
            className="recipe_recomendations"
          >
            {
              recipes && recipes
                .filter((_, index) => index < MAXIMUM_RECIPES)
                .map(({ idDrink: id2, strDrink, strDrinkThumb }, index) => (
                  <Link key={ id2 } to={ `/drinks/${id2}` }>
                    <div
                      data-testid={ `${index}-recomendation-card` }
                      className="recipe_card"
                    >
                      <h3 data-testid={ `${index}-recomendation-title` }>{strDrink}</h3>
                      <img
                        src={ strDrinkThumb }
                        alt={ strDrink }
                        className="recipe_card_img"
                      />
                    </div>
                  </Link>
                ))
            }
          </div>
        </div>
      </div>
    );
  };
  return (
    <main>
      {meal.strMeal && renderDetails()}
      {recipeStatus === 'new recipe' && (
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="start_recipe_btn"
          onClick={ () => history.push(`/foods/${id}/in-progress`) }
        >
          Start Recipe
        </button>
      )}
      {recipeStatus === 'in progress' && (
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="start_recipe_btn"
          onClick={ () => history.push(`/foods/${id}/in-progress`) }
        >
          Continue Recipe
        </button>
      )}
    </main>
  );
}
export default MealRecipeDetails;
