import axios from 'axios';

// Dataset Status
export const REQUEST_DATASET_STATUS = 'REQUEST_DATASET_STATUS';
export const RECEIVE_DATASET_STATUS = 'RECEIVE_DATASET_STATUS';

const requestDatasetStatus = () => ({
  type: REQUEST_DATASET_STATUS,
});

const receiveDatasetStatus = json => ({
  type: RECEIVE_DATASET_STATUS,
  datasetDetail: json.data,
});

export const fetchDatasetStatus = datasetId => (
  (dispatch) => {
    dispatch(requestDatasetStatus());

    return axios.get(
      `/api/v1/datasets/${datasetId}/status`,
      {
        headers: {
          Authorization: `TD1 ${sessionStorage.getItem('apiKey')}`,
        },
      },
    )
      .then(res => dispatch(receiveDatasetStatus(res.data)));
  }
);

// Datasets
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
      .then((res) => {
        dispatch(receiveDatasets(res.data));
        console.log({ res });
        res.data.datasets.map(d => dispatch(fetchDatasetStatus(d.id)));
      });
  }
);

// Workflows
export const REQUEST_WORKFLOWS = 'REQUEST_WORKFLOWS';
export const RECEIVE_WORKFLOWS = 'RECEIVE_WORKFLOWS';

const requestWorkflows = () => ({
  type: REQUEST_WORKFLOWS,
});

const receiveWorkflows = json => ({
  type: RECEIVE_WORKFLOWS,
  workflows: json.workflows,
});

export const fetchWorkflows = () => (
  (dispatch) => {
    dispatch(requestWorkflows());

    return axios.get(
      '/api/v1/datasets/workflows',
      {
        headers: {
          Authorization: `TD1 ${sessionStorage.getItem('apiKey')}`,
        },
      },
    )
      .then(res => dispatch(receiveWorkflows(res.data)));
  }
);
