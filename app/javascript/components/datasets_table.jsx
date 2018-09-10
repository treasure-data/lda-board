import React from 'react';
import {
  Table,
  Badge,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const tableKeys = ['id'];

const DatasetsTable = (props) => {
  const { datasets, onFetch } = props;

  return (
    <Table>
      <thead>
        <tr>
          {
            tableKeys.map(k => (
              <th key={`thead${k}`}>
                {k}
              </th>
            ))
          }
          <th>
            workflow_id
          </th>
          <th>
            session_id
          </th>
          <th>
            wf status
          </th>
          <th>
            fetch status
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {
          datasets.map(dataset => (
            <tr key={dataset.id}>
              {
                tableKeys.map(k => (
                  <td key={`${k}_${dataset.id}`}>
                    {
                      dataset[k]
                    }
                  </td>
                ))
              }
              <td>
                <a href={dataset.workflow_detail_url_on_td} target="_brank">
                  {dataset.workflow_id}
                </a>
              </td>
              <td>
                <a href={dataset.session_detail_url_on_td} target="_brank">
                  {dataset.session_id}
                </a>
              </td>
              <td>
                aa
              </td>
              <td>
                <Badge className="mr-2">
                  status
                </Badge>
                <Button color="secondary" size="sm" onClick={() => onFetch(dataset.id)}>
                  Fetch from TD
                </Button>
              </td>
              <td>
                <Link to={`/boards/${dataset.id}`}>
                  <Button color="primary" size="sm">
                    Visualize
                  </Button>
                </Link>
              </td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
};

DatasetsTable.propTypes = {
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onFetch: PropTypes.func.isRequired,
};

export default DatasetsTable;
