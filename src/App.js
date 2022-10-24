import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import MyProvider from './context/MyProvider';
import Login from './pages/Login';
import Foods from './pages/Foods';
import Drinks from './pages/Drinks';
import Explore from './pages/Explore';
import ExploreFoods from './pages/ExploreFoods';
import ExploreDrinks from './pages/ExploreDrinks';
import ExFoodsIngredients from './pages/ExFoodsIngredients';
import ExDrinksIngredients from './pages/ExDrinksIngredients';
import ExFoodsNationalities from './pages/ExFoodsNationalities';
import Profile from './pages/Profile';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';
import NotFound from './pages/NotFound';
import MealRecipeDetails from './pages/MealRecipeDetails';
import DrinkRecipeDetails from './pages/DrinkRecipeDetails';
import FoodsInProgress from './pages/FoodsInProgress';
import DrinksInProgress from './pages/DrinksInProgress';

function App() {
  return (
    <BrowserRouter>
      <MyProvider>
        <Switch>
          <Route exact path="/" component={ Login } />
          <Route exact path="/foods" component={ Foods } />
          <Route exact path="/drinks" component={ Drinks } />
          <Route exact path="/foods/:id" component={ MealRecipeDetails } />
          <Route exact path="/drinks/:id" component={ DrinkRecipeDetails } />
          <Route exact path="/foods/:id/in-progress" component={ FoodsInProgress } />
          <Route exact path="/drinks/:id/in-progress" component={ DrinksInProgress } />
          <Route exact path="/explore" component={ Explore } />
          <Route exact path="/explore/foods" component={ ExploreFoods } />
          <Route exact path="/explore/drinks" component={ ExploreDrinks } />
          <Route
            exact
            path="/explore/foods/ingredients"
            component={ ExFoodsIngredients }
          />
          <Route
            exact
            path="/explore/drinks/ingredients"
            component={ ExDrinksIngredients }
          />
          <Route
            exact
            path="/explore/foods/nationalities"
            component={ ExFoodsNationalities }
          />
          <Route path="/profile" component={ Profile } />
          <Route path="/done-recipes" component={ DoneRecipes } />
          <Route path="/favorite-recipes" component={ FavoriteRecipes } />
          <Route path="/explore/drinks/nationalities" component={ NotFound } />
        </Switch>
      </MyProvider>
    </BrowserRouter>
  );
}

export default App;
