import React from 'react';
import {
  Table,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import WorkFlowStatusBadge from './workflow_status_badge';

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
            created_at
          </th>
          <th>
            last_fetched_at
          </th>
          <th />
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
                <WorkFlowStatusBadge
                  status={dataset.status || {}}
                  isFetching={dataset.isFetching === undefined ? true : dataset.isFetching}
                />
              </td>
              <td>
                <small>
                  {dataset.created_at}
                </small>
              </td>
              <td>
                <small>
                  {
                    (dataset.created_at === dataset.updated_at)
                      ? '-'
                      : `${dataset.updated_at}`
                  }
                </small>
              </td>
              <td>
                <Button color="secondary" outline size="sm" onClick={() => onFetch(dataset.id)}>
                  Fetch from TD
                </Button>
              </td>
              <td>
                <Link to={`/boards/${dataset.id}`}>
                  <Button color="primary" size="sm" disabled={dataset.created_at === dataset.updated_at}>
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
