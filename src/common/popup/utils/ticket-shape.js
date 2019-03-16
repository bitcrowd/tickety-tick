import PropTypes from 'prop-types';

const FmtShape = PropTypes.shape({
  commit: PropTypes.string.isRequired,
  branch: PropTypes.string.isRequired,
  command: PropTypes.string.isRequired,
});

const TicketShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  url: PropTypes.string,
  fmt: FmtShape.isRequired,
});

export default TicketShape;
