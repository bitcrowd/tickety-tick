import PropTypes from 'prop-types';

const ErrorShape = PropTypes.shape({
  message: PropTypes.string.isRequired,
});

export default ErrorShape;
