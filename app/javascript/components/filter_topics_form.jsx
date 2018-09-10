import React from 'react';
import {
  Form,
  FormGroup,
  Input,
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';

class FilterTopicsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      targetTerm: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ targetTerm: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { targetTerm } = this.state;
    const term = targetTerm.length > 0 ? targetTerm : undefined;
    const { onSubmit } = this.props;
    onSubmit(term);
  }

  render() {
    const { targetTerm } = this.state;
    return (
      <Form inline onSubmit={this.handleSubmit}>
        <FormGroup className="mr-2">
          <Input
            type="text"
            value={targetTerm}
            onChange={this.handleChange}
            placeholder="filter topics by terms"
          />
        </FormGroup>

        <Button>
          filter
        </Button>
      </Form>
    );
  }
}

FilterTopicsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default FilterTopicsForm;
