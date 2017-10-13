import PropTypes from 'prop-types';

const TicketShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
});

export default TicketShape;
