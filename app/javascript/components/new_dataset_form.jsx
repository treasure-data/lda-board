import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  Button,
  FormGroup,
  Label,
  Alert,
} from 'reactstrap';


class NewDatasetForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      workflowId: undefined,
      params: {
        sessionNumberOfTopics: 10,
      },
    };

    this.handleWorkflowIdChange = this.handleWorkflowIdChange.bind(this);
    this.handleSessionNumberOfTopicsChange = this.handleSessionNumberOfTopicsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleWorkflowIdChange(event) {
    this.setState({
      workflowId: event.target.value,
    });
  }

  handleSessionNumberOfTopicsChange(event) {
    this.setState({
      params: {
        sessionNumberOfTopics: event.target.value,
      },
    });
  }

  handleSubmit() {
    const { onSubmit } = this.props;
    onSubmit(this.state);
  }

  render() {
    const { workflows } = this.props;
    const { workflowId, params } = this.state;
    const { sessionNumberOfTopics } = params;

    const currentWorkflow = workflows.items.find(w => w.id === workflowId) || {};
    const currentConfig = 'config' in currentWorkflow ? currentWorkflow.config : {};
    /* eslint-disable */
    const currentExport = '_export' in currentConfig ? currentConfig['_export'] : {};
    /* eslint-enable */

    if (workflows.isFetching) {
      return (
        <Alert color="primary">
          loading...
        </Alert>
      );
    }

    return (
      <div>
        <FormGroup>
          <Label>
            select a workflow
          </Label>
          <Input type="select" value={workflowId} onChange={this.handleWorkflowIdChange}>
            {
              workflows.items.map((workflow) => {
                const { id, name, project } = workflow;
                const projectName = project.name;
                return (
                  <option key={id} value={id}>
                    {
                      `${name} (${projectName})`
                    }
                  </option>
                );
              })
            }
          </Input>
        </FormGroup>

        <FormGroup>
          <Label>
            number of topics
          </Label>
          <Input type="number" value={sessionNumberOfTopics} onChange={this.handleSessionNumberOfTopicsChange} />
        </FormGroup>

        <Button color="primary" onClick={this.handleSubmit}>
          Add
        </Button>

        <hr />

        <pre>
          {JSON.stringify(currentExport, undefined, 1)}
        </pre>
      </div>
    );
  }
}

NewDatasetForm.propTypes = {
  workflows: PropTypes.shape({
    isFetching: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default NewDatasetForm;
