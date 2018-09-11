import React from 'react';
import {
  Badge,
} from 'reactstrap';

import PropTypes from 'prop-types';

const createBadgeContent = (status, isFetching) => {
  if (isFetching) {
    return {
      color: 'light',
      text: 'loading...',
    };
  }

  if (status.cancelRequested === true) {
    return {
      color: 'warning',
      text: 'canceled',
    };
  }

  if (status.done === true && status.success === true) {
    return {
      color: 'success',
      text: 'success',
    };
  }

  if (status.done === true && status.success === false) {
    return {
      color: 'danger',
      text: 'failed',
    };
  }

  return {
    color: 'dark',
    text: 'working',
  };
};

const WorkFlowStatusBadge = (props) => {
  const { status, isFetching } = props;
  const { color, text } = createBadgeContent(status, isFetching);

  return (
    <Badge color={color} pill>
      {text}
    </Badge>
  );
};

WorkFlowStatusBadge.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  status: PropTypes.shape({
    done: PropTypes.bool,
  }).isRequired,
};

export default WorkFlowStatusBadge;
