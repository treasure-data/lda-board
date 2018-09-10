import axios from 'axios';

export const REQUEST_DATASETS = 'REQUEST_DATASETS';
export const RECEIVE_DATASETS = 'RECEIVE_DATASETS';

const requestDatasets = () => ({
  type: REQUEST_DATASETS,
});

const receiveDatasets = json => ({
  type: RECEIVE_DATASETS,
  datasets: json.datasets,
});

export const fetchDatasets = () => (
  (dispatch) => {
    dispatch(requestDatasets());

    return axios.get(
      '/api/v1/datasets',
      {
        headers: {
          Authorization: `TD1 ${sessionStorage.getItem('apiKey')}`,
        },
      },
    )
      .then(res => dispatch(receiveDatasets(res.data)));
  }
);
