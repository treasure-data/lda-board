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
} from '../actions';

class DatasetsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasets: [],
      workflows: [],
      modal: false,
    };

    this.toggle = this.toggle.bind(this);

    this.handleCreateDataset = this.handleCreateDataset.bind(this);
    this.handleFetchResult = this.handleFetchResult.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDatasets());

    const apiKey = sessionStorage.getItem('apiKey');
    const instance = axios.create({
      headers: {
        Authorization: `TD1 ${apiKey}`,
      },
    });

    instance.get('/api/v1/datasets')
      .then((res) => {
        const { datasets, sessions } = res.data;
        const mdatasets = datasets.map((d, index) => ({
          ...d,
          session: sessions[index],
        }));
        this.setState({ datasets: mdatasets });
      });

    instance.get('/api/v1/datasets/workflows')
      .then((res) => {
        const { workflows } = res.data;
        this.setState({ workflows });
      });
  }

  toggle() {
    const { modal } = this.state;
    this.setState({
      modal: !modal,
    });
  }

  handleCreateDataset(options) {
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

        instance.get('/api/v1/datasets')
          .then((res) => {
            const { datasets, sessions } = res.data;
            const mdatasets = datasets.map((d, index) => ({
              ...d,
              session: sessions[index],
            }));
            this.setState({ datasets: mdatasets });
          });
      });
  }

  handleFetchResult(datasetId) {
    const apiKey = sessionStorage.getItem('apiKey');
    const instance = axios.create({
      headers: {
        Authorization: `TD1 ${apiKey}`,
      },
    });

    instance.get(`/api/v1/datasets/${datasetId}/fetch`)
      .then(() => {
        this.setState();
      });
  }

  render() {
    const { datasets = [], workflows = [], modal } = this.state;
    return (
      <Container>
        <h1 className="my-3">
          List of Datasets
        </h1>

        <Button color="primary" className="mb-3" onClick={this.toggle}>
          Add
        </Button>

        <DatasetsTable datasets={datasets} onFetch={this.handleFetchResult} />

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
};

const mapStateToProps = (state) => {
  const { datasets } = state;
  return { datasets };
};

export default connect(mapStateToProps)(DatasetsContainer);
