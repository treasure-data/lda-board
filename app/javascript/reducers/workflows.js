import {
  REQUEST_WORKFLOWS,
  RECEIVE_WORKFLOWS,
} from '../actions';

const defaultState = {
  isFetching: false,
  items: [],
};

const workflows = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_WORKFLOWS:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case RECEIVE_WORKFLOWS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.workflows,
      });

    default:
      return state;
  }
};

export default workflows;
