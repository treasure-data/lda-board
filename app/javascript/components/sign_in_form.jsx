import React from 'react';
import {
  Card,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import PropTypes from 'prop-types';

class SignInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  handleChange(event) {
    this.setState({
      apiKey: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { apiKey } = this.state;
    const { onSubmit } = this.props;
    onSubmit(apiKey);
  }

  render() {
    const { apiKey } = this.state;
    return (
      <Card body>
        <CardTitle>
          sign in
        </CardTitle>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>
              API Key
            </Label>
            <Input value={apiKey} onChange={this.handleChange} />
          </FormGroup>
          <Button>
            sign in
          </Button>
        </Form>
      </Card>
    );
  }
}

SignInForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SignInForm;
