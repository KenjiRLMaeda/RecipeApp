import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import copy from 'clipboard-copy';
import fetchAPI from '../../services/fetchAPI';
import ShareButton from '../../components/ShareButton';
import FavoriteButton from '../../components/FavoriteButton';

const ingredientsIndexes = [];
const MAXIMUM_INGREDIENTS_INDEX = 15;
for (let index = 1; index <= MAXIMUM_INGREDIENTS_INDEX; index += 1) {
  ingredientsIndexes.push(index);
}
const MAXIMUM_RECIPES = 6;
const newRecipe = 'new recipe';
function DrinkRecipeDetails() {
  const [recipes, setRecipes] = useState([]);
  const [drink, setDrink] = useState({});
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
        strIngredient: drink[`strIngredient${index}`],
        strMeasure: drink[`strMeasure${index}`],
      };
      return newIngredient;
    }).filter((ingredient) => ingredient.strIngredient !== null);
    setIngredients(newIngredients);
  }, [drink]);

  // resgata as infos do localStorage para ver o andamento da receita:
  useEffect(() => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    if (!doneRecipes) {
      setRecipeStatus(newRecipe);
    }
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (inProgressRecipes && inProgressRecipes.cocktails) {
      const isRecipeInProgress = inProgressRecipes.cocktails[id];
      if (isRecipeInProgress) {
        setRecipeStatus('in progress');
      }
    }
    if (doneRecipes) {
      const isRecipeDone = doneRecipes.some((recipe) => +recipe.id === +id);
      if (isRecipeDone) {
        setRecipeStatus('done');
      } else {
        setRecipeStatus(newRecipe);
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
    async function fetchById() {
      const drinkById = await fetchAPI(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`, 'drinks');
      setDrink(drinkById[0]);
    }
    fetchById();
  }, [id]);

  useEffect(() => {
    async function fetchCategories() {
      const dataFetched = await fetchAPI('https://www.themealdb.com/api/json/v1/1/search.php?s=', 'meals');
      setRecipes(dataFetched);
    }
    fetchCategories();
  }, []);

  const handleShare = () => {
    const mealUrl = history.location.pathname;
    const formatedUrl = `http://localhost:3000${mealUrl}`;
    copy(formatedUrl);
    setIsCopied(true);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    const { strCategory, strDrink, strDrinkThumb, strAlcoholic } = drink;
    const favoritedRecipes = localStorage.getItem('favoriteRecipes');
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
    const {
      strDrink,
      strDrinkThumb,
      strCategory,
      strInstructions,
      strAlcoholic,
    } = drink;
    return (
      <div className="recipe_details_component">
        <img
          src={ strDrinkThumb }
          alt="drink template"
          data-testid="recipe-photo"
          width="360"
        />
        <div key={ strDrink } className="recipe_container">
          <div className="recipe_info">
            <h1 data-testid="recipe-title">{strDrink}</h1>
            <h4 data-testid="recipe-category">{`| ${strCategory} - ${strAlcoholic}`}</h4>
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
            <h2>Ingredients</h2>
            <ul>
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
            <p data-testid="instructions">
              {strInstructions}
            </p>
          </div>
          <div
            className="recipe_recomendations"
          >
            {
              recipes && recipes
                .filter((_, index) => index < MAXIMUM_RECIPES)
                .map(({ idMeal, strMeal, strMealThumb }, index) => (
                  <Link key={ index } to={ `/foods/${idMeal}` }>
                    <div
                      data-testid={ `${index}-recomendation-card` }
                      className="recipe_card"
                    >
                      <h3 data-testid={ `${index}-recomendation-title` }>{strMeal}</h3>
                      <img
                        src={ strMealThumb }
                        alt={ strMeal }
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
      {drink.strDrink && renderDetails()}
      {recipeStatus === 'new recipe' && (
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="start_recipe_btn"
          onClick={ () => history.push(`/drinks/${id}/in-progress`) }
        >
          Start Recipe
        </button>
      )}
      {recipeStatus === 'in progress' && (
        <button
          data-testid="start-recipe-btn"
          type="button"
          className="start_recipe_btn"
          onClick={ () => history.push(`/drinks/${id}/in-progress`) }
        >
          Continue Recipe
        </button>
      )}
    </main>
  );
}

export default DrinkRecipeDetails;
