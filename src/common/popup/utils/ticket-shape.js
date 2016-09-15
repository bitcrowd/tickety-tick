import React from 'react';

const TicketShape = React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
});

export default TicketShape;
