import {
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
} from '../actions';

const defaultState = {
  isFetching: false,
  items: [],
};

const datasets = (state = defaultState, action) => {
  switch (action.type) {
    case REQUEST_DATASETS:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case RECEIVE_DATASETS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.datasets,
      });

    default:
      return state;
  }
};

export default datasets;
