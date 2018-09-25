import React from 'react';
import {
  Container,
  Row,
  Col,
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

import BubbleChart from '../components/bubble_chart';
import FilterTopicsForm from '../components/filter_topics_form';
import TopicElementsTable from '../components/topic_elements_table';
import TopTermsTable from '../components/top_terms_table';

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

    const targetTopicIds = ldaModel.map(l => l.some(x => (x.word.match(targetTerm))));

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
          <Col sm="8">
            <Card className="mb-4">
              <CardBody>
                <span className="pr-3">
                  {'Selected Topic: '}
                  {topics[targetTopic] ? topics[targetTopic].topic_id : null}
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

            <Card>
              <CardBody>
                <CardTitle className="m-0">
                  Topic elements
                </CardTitle>
              </CardBody>
              <CardBody className="py-0">
                <TopicElementsTable docments={predictedTopics[targetTopic] || []} />
              </CardBody>
            </Card>
          </Col>

          <Col sm="4">
            <Card body className="mb-4">
              <FilterTopicsForm onSubmit={this.handleChangeTargetTerm} />
            </Card>

            <Card className="mb-4">
              <CardBody>
                <CardTitle className="m-0">
                  Top terms
                </CardTitle>
              </CardBody>
              <CardBody className="py-0">
                <TopTermsTable terms={ldaModel[targetTopic] || []} />
              </CardBody>
            </Card>

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
