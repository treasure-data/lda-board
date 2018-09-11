import React from 'react';
import {
  Table,
} from 'reactstrap';

import PropTypes from 'prop-types';

const TopicElementsTable = (props) => {
  const { docments } = props;

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
          docments.map((doc) => {
            const { docid, proba1 } = doc;
            return (
              <tr key={docid}>
                <td>
                  {docid}
                </td>
                <td>
                  {proba1}
                </td>
                <td />
              </tr>
            );
          })
        }
      </tbody>
    </Table>
  );
};

TopicElementsTable.propTypes = {
  docments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })).isRequired,
};

export default TopicElementsTable;
