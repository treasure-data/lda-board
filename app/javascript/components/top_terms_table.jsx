import React from 'react';
import {
  Table,
} from 'reactstrap';

import PropTypes from 'prop-types';

const TopTermsTable = (props) => {
  const { terms } = props;

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
          terms.map((doc) => {
            const { id, word, lambda } = doc;
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
          })
        }
      </tbody>
    </Table>
  );
};

TopTermsTable.propTypes = {
  terms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
  })).isRequired,
};

export default TopTermsTable;
