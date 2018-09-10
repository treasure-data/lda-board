import React from 'react';
import {
  Container,
  Row,
  Col,
  Alert,
} from 'reactstrap';
import axios from 'axios';
import {
  Redirect,
} from 'react-router-dom';

import SignInForm from '../components/sign_in_form';

class SignInContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'default',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const apiKey = sessionStorage.getItem('apiKey');
    if (apiKey !== null) {
      this.handleSubmit(apiKey);
    }
  }

  handleSubmit(apiKey) {
    const instance = axios.create({
      headers: {
        Authorization: `TD1 ${apiKey}`,
      },
    });

    instance.get('/api/v1/datasets')
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem('apiKey', apiKey);
          this.setState({ status: 'success' });
        } else {
          this.setState({ status: 'danger' });
        }
      });
  }

  render() {
    const { status } = this.state;
    const content = (() => {
      switch (status) {
        case 'success':
          return <Redirect to="/datasets" />;
        case 'danger':
          return (
            <div>
              <Alert color="danger">
                This is a danger alert — check it out!
              </Alert>
              <SignInForm onSubmit={this.handleSubmit} />
            </div>
          );
        default:
          return <SignInForm onSubmit={this.handleSubmit} />;
      }
    })();

    return (
      <Container>
        <Row>
          <Col sm="6" className="mt-3">
            {content}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignInContainer;
