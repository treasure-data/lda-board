import {
  REQUEST_DATASETS,
  RECEIVE_DATASETS,
  REQUEST_DATASET_STATUS,
  RECEIVE_DATASET_STATUS,
} from '../actions';

// Dataset status
const defaultDatasetStatus = {
  isFetching: false,
  state: {},
};

const datasetStatus = (state = defaultDatasetStatus, action) => {
  switch (action.type) {
    case REQUEST_DATASET_STATUS:
      return Object.assign({}, state, {
        isFetching: true,
        status: {},
      });

    case RECEIVE_DATASET_STATUS:
      if (state.id === action.datasetId) {
        return Object.assign({}, state, {
          isFetching: false,
          status: action.datasetStatus,
        });
      }

      return state;

    default:
      return state;
  }
};

// Datasets
const defaultDatasets = {
  isFetching: false,
  items: [],
};

const datasets = (state = defaultDatasets, action) => {
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

    case RECEIVE_DATASET_STATUS:
      return Object.assign({}, state, {
        isFetching: false,
        items: state.items.map(item => datasetStatus(item, action)),
      });

    default:
      return state;
  }
};

export default datasets;
