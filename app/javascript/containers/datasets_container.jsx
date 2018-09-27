import React from 'react';
import PropTypes from 'prop-types';
import {
  connect,
} from 'react-redux';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import axios from 'axios';

import DatasetsTable from '../components/datasets_table';
import NewDatasetForm from '../components/new_dataset_form';
import {
  fetchDatasets,
  fetchWorkflows,
  fetchDatasetStatus,
} from '../actions';

class DatasetsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);

    this.handleCreateDataset = this.handleCreateDataset.bind(this);
    this.handleFetchResult = this.handleFetchResult.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasets());

    this.pollingMethod = setInterval(() => {
      const { datasets } = this.props;
      datasets.items.map((d) => {
        if (d.fetch_status === 'working') {
          dispatch(fetchDatasets());
          return 0;
        }
        if (!d.session_id || d.status.isFetching) {
          return 0;
        }
        if (!d.status || !d.status.done) {
          dispatch(fetchDatasetStatus(d.id, true));
        }
        return 0;
      });
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.pollingMethod);
  }

  toggle() {
    const { dispatch } = this.props;
    const { modal } = this.state;
    if (!modal) {
      dispatch(fetchWorkflows());
    }
    this.setState({
      modal: !modal,
    });
  }

  handleCreateDataset(options) {
    const { dispatch } = this.props;
    const apiKey = sessionStorage.getItem('apiKey');
    const instance = axios.create({
      headers: {
        Authorization: `TD1 ${apiKey}`,
      },
    });

    const postOptions = {
      workflow_id: options.workflowId,
      session_params: {
        session_num_topics: options.params.sessionNumberOfTopics,
      },
    };

    instance.post('/api/v1/datasets', postOptions)
      .then(() => {
        this.setState({ modal: false });
        dispatch(fetchDatasets());
      });
  }

  handleFetchResult(datasetId) {
    const { dispatch } = this.props;
    const apiKey = sessionStorage.getItem('apiKey');
    const instance = axios.create({
      headers: {
        Authorization: `TD1 ${apiKey}`,
      },
    });

    instance.get(`/api/v1/datasets/${datasetId}/fetch`)
      .then(() => {
        this.setState();
        dispatch(fetchDatasets());
      });
  }

  render() {
    const { datasets, workflows } = this.props;
    const { modal } = this.state;

    return (
      <Container>
        <h1 className="my-3">
          List of Datasets
        </h1>

        <Button color="primary" className="mb-3" onClick={this.toggle}>
          Add
        </Button>

        <DatasetsTable datasets={datasets.items} onFetch={this.handleFetchResult} />

        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>
            Add new dataset
          </ModalHeader>
          <ModalBody>
            <NewDatasetForm
              workflows={workflows}
              onSubmit={this.handleCreateDataset}
            />
          </ModalBody>
        </Modal>

      </Container>
    );
  }
}

DatasetsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  datasets: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.array,
  }).isRequired,
  workflows: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = (state) => {
  const { datasets, workflows } = state;
  return { datasets, workflows };
};

export default connect(mapStateToProps)(DatasetsContainer);
