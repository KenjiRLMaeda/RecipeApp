import PropTypes from 'prop-types';
import React from 'react';
import shareIcon from '../../images/shareIcon.svg';

function ShareButton({ handleShare }) {
  return (
    <button
      type="button"
      onClick={ handleShare }
    >
      <img src={ shareIcon } alt="Share Icon" data-testid="share-btn" />
    </button>
  );
}

ShareButton.propTypes = {
  handleShare: PropTypes.func.isRequired,
};

export default ShareButton;
