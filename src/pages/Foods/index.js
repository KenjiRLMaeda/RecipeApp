import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import myContext from '../../context/myContext';
import fetchAPI from '../../services/fetchAPI';
import './index.css';
import RecipeCard from '../../components/RecipeCard';

const MAXIMUM_RECIPES = 12;
const MAXIMUM_CATEGORIES = 5;

function Foods() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');

  const { search, setSearch } = useContext(myContext);

  useEffect(() => {
    const endpoint = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';

    async function fetchCategories() {
      const dataFetched = await fetchAPI(endpoint, 'meals');
      setCategories(dataFetched);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const endpoint = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryFilter}`;

    async function fetchRecipesByCategory() {
      const dataFetched = await fetchAPI(endpoint, 'meals');
      setRecipes(dataFetched);
    }
    if (categoryFilter.length) {
      fetchRecipesByCategory();
    }
  }, [categoryFilter]);

  useEffect(() => {
    let endpoint = '';
    switch (search.type) {
    case 'name':
      endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${search.input}`;
      break;
    case 'ingredient':
      endpoint = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${search.input}`;
      break;
    case 'first-letter':
      endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?f=${search.input}`;
      break;
    default:
      break;
    }

    async function fetchRecipes() {
      const dataFetched = await fetchAPI(endpoint, 'meals');
      setRecipes(dataFetched);
    }
    fetchRecipes();
  }, [search]);

  const history = useHistory();

  useEffect(() => {
    if (!recipes) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
    } else if (recipes.length === 1 && categoryFilter === '') {
      history.push(`/foods/${recipes[0].idMeal}`);
    }
  }, [recipes, history, categoryFilter]);

  const toggleCategoryFilter = (categoryChosen) => {
    if (categoryFilter === categoryChosen) {
      setCategoryFilter('');
      setSearch({ input: '', type: 'name' });
    } else {
      setCategoryFilter(categoryChosen);
    }
  };

  return (
    <>
      <Header headerTitle="Foods" />
      <div className="all-buttons-foods">
        <button
          type="button"
          className="category-button"
          data-testid="All-category-filter"
          onClick={ () => setSearch({ input: '', type: 'name' }) }
        >
          All categories
        </button>
        {
          categories && categories
            .slice(0, MAXIMUM_CATEGORIES)
            .map(({ strCategory }) => (
              <button
                type="button"
                className="category-button"
                key={ strCategory }
                data-testid={ `${strCategory}-category-filter` }
                onClick={ () => toggleCategoryFilter(strCategory) }
              >
                {strCategory}
              </button>
            ))
        }
      </div>
      <div className="recipes-container">
        {
          recipes && recipes
            .filter((_, index) => index < MAXIMUM_RECIPES)
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
    </>
  );
}

export default Foods;
