import PropTypes from 'prop-types';

const ErrorShape = PropTypes.shape({
  message: PropTypes.string.isRequired,
  stack: PropTypes.string,
});

export default ErrorShape;
