export const REQUEST_DATASETS = 'REQUEST_DATASETS';
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS';

const requestDatasets = () => ({
  type: REQUEST_DATASETS,
});

const receiveDatasets = json => ({
  type: RECEIVE_DATASETS,
  datasets: json,
});

export const fetchDatasets = () => (
  (dispatch) => {
    dispatch(requestDatasets());

    return dispatch(receiveDatasets({}));
  }
);
