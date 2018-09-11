import React from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  CardBody,
  CardTitle,
  Alert,
  Button,
} from 'reactstrap';
import {
  Link,
} from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

import BubbleChart from '../components/bubble_chart';
import FilterTopicsForm from '../components/filter_topics_form';

const Term = (props) => {
  const { term } = props;
  const {
    id, word, lambda,
  } = term;
  return (
    <tr key={id}>
      <td>
        {word}
      </td>
      <td>
        {lambda}
      </td>
    </tr>
  );
};

Term.propTypes = {
  term: PropTypes.shape({
    label: PropTypes.number.isRequired,
  }).isRequired,
};

const TopicTerms = (props) => {
  const { topicTerms, targetTopic } = props;

  if (targetTopic === -1) {
    return (
      <div>
        not selected
      </div>
    );
  }

  return (
    <Table size="sm" hover>
      <thead>
        <tr>
          <th>
            Term
          </th>
          <th>
            Probability
          </th>
        </tr>
      </thead>
      <tbody>
        {
          topicTerms.map(terms => (
            terms.slice(0, 15).map(term => (
              (term.label === targetTopic)
                ? <Term key={term.id} term={term} />
                : null
            ))
          ))
        }
      </tbody>
    </Table>
  );
};

TopicTerms.propTypes = {
  topicTerms: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    ),
  ).isRequired,
  targetTopic: PropTypes.number.isRequired,
};

const TopicDocs = (props) => {
  const { topicDocs, targetTopic } = props;

  if (targetTopic === -1) {
    return (
      <div>
        not selected
      </div>
    );
  }

  const docs = topicDocs[targetTopic] || [];

  return (
    <Table size="sm" hover>
      <thead>
        <tr>
          <th>
            ID
          </th>
          <th>
            Probability
          </th>
          <th>
            Content
          </th>
        </tr>
      </thead>
      <tbody>
        {
          docs.slice(0, 15).map((doc) => {
            const { docid, proba1 } = doc;
            return (
              <tr key={docid}>
                <td>
                  {docid}
                </td>
                <td>
                  {proba1}
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
};

TopicDocs.propTypes = {
  topicDocs: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    ),
  ).isRequired,
  targetTopic: PropTypes.number.isRequired,
};


class BoardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      ldaModel: [],
      predictedTopics: [],
      targetTopic: 0,
      targetTerm: undefined,
    };

    this.handleChangeTargetTopic = this.handleChangeTargetTopic.bind(this);
    this.handleChangeTargetTerm = this.handleChangeTargetTerm.bind(this);
  }

  componentDidMount() {
    const apiKey = sessionStorage.getItem('apiKey');
    const instance = axios.create({
      headers: {
        Authorization: `TD1 ${apiKey}`,
      },
    });
    const targetId = window.location.pathname.split('/')[2];
    instance.get(`/api/v1/datasets/${targetId}`)
      .then((res) => {
        const {
          topics,
          ldaModel,
          predictedTopics,
        } = res.data;
        this.setState({
          topics,
          ldaModel,
          predictedTopics,
        });
      });
  }

  handleChangeTargetTopic(targetTopic) {
    this.setState({ targetTopic });
  }

  handleChangeTargetTerm(targetTerm) {
    this.setState({ targetTerm });
  }

  render() {
    const targetId = window.location.pathname.split('/')[2];
    const {
      topics,
      ldaModel,
      targetTopic,
      targetTerm,
      predictedTopics,
    } = this.state;

    const targetTopicIds = ldaModel.map(l => l.some(x => (x.word === targetTerm)));

    const visibleTopics = (targetTerm === undefined)
      ? topics.map(t => ({ ...t, visible: true }))
      : topics.map(t => ({ ...t, visible: targetTopicIds[t.topic_id] }));

    return (
      <Container>
        <h1 className="my-3">
          {'Visualize Dataset #'}
          {targetId}
        </h1>

        <Link to="/datasets">
          List of Datasets
        </Link>

        <hr />

        <Row className="mb-4">
          <Col>
            <Card body>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  {'# of topics: '}
                  {topics.length}
                </li>
              </ul>
            </Card>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <Card>
              <CardBody>
                <span className="pr-3">
                  {'Selected Topic: '}
                  {targetTopic}
                </span>

                <Button
                  size="sm"
                  className="mr-1"
                  onClick={() => this.handleChangeTargetTopic(targetTopic - 1)}
                  disabled={targetTopic <= 0}
                >
                  Prev Topic
                </Button>

                <Button
                  size="sm"
                  onClick={() => this.handleChangeTargetTopic(targetTopic + 1)}
                  disabled={targetTopic >= topics.length - 1}
                >
                  Next Topic
                </Button>

                <hr />

                <BubbleChart
                  topics={visibleTopics}
                  targetTopic={targetTopic}
                  onSelectTopic={this.handleChangeTargetTopic}
                />
              </CardBody>
            </Card>
          </Col>
          <Col sm="4">
            <Card body className="mb-4">
              <FilterTopicsForm onSubmit={this.handleChangeTargetTerm} />
            </Card>

            <Card>
              <CardBody>
                <CardTitle className="m-0">
                  Top terms
                </CardTitle>
              </CardBody>
              <CardBody className="py-0">
                <TopicTerms topicTerms={ldaModel} targetTopic={targetTopic} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="my-4">
          <Col>
            <Card>
              <CardBody>
                <CardTitle className="m-0">
                  Topic elements
                </CardTitle>
              </CardBody>
              <CardBody className="py-0">
                <TopicDocs topicDocs={predictedTopics} targetTopic={targetTopic} />
              </CardBody>
            </Card>
          </Col>

          <Col sm="4">
            <Card body>
              <p>
                debug info
              </p>
              <Alert color="dark" className="mt-4">
                <div>
                  <span className="mr-3">
                    Visible Topics:
                  </span>
                  { targetTopicIds.join(' ') }
                </div>
              </Alert>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default BoardContainer;
