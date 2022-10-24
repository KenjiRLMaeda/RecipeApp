import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { getLocalStorage } from '../../services/localStorage';

function Checkbox({
  ingredient,
  measure,
  index,
  id,
  handleIngredientClick,
  usedIngredients,
  setUsedIngredients,
}) {
  const [isIngredientUsed, setIsIngredientUsed] = useState(false);
  const [labelClassName, setLabelClassName] = useState('');
  const [isEverythingDone, setIsEverythingDone] = useState(false);

  const inProgressRecipes = getLocalStorage('inProgressRecipes');
  useEffect(() => {
    if (inProgressRecipes
     && inProgressRecipes.cocktails && inProgressRecipes.cocktails[id]) {
      setUsedIngredients(inProgressRecipes.cocktails);
    }
  }, []);

  useEffect(() => {
    if (usedIngredients[id].includes(ingredient)) {
      setIsIngredientUsed(true);
      setLabelClassName('ingredient-is-done');
      setIsEverythingDone(true);
    }
    setIsEverythingDone(true);
  }, [usedIngredients]);

  return (
    isEverythingDone && (
      <label
        htmlFor={ `ingredient-${index}` }
        className={ `ingredients-checkboxes ${labelClassName}` }
        key={ index }
        data-testid={ `${index}-ingredient-step` }
      >
        <input
          type="checkbox"
          id={ `ingredient-${index}` }
          value={ ingredient }
          onChange={ (e) => handleIngredientClick(e.target) }
          checked={ isIngredientUsed }
        />
        { `${ingredient} - ${measure}` }
      </label>
    )
  );
}

Checkbox.propTypes = {
  handleIngredientClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  ingredient: PropTypes.string.isRequired,
  measure: PropTypes.string.isRequired,
  setUsedIngredients: PropTypes.func.isRequired,
  usedIngredients: PropTypes.instanceOf(Object).isRequired,
};

export default Checkbox;
