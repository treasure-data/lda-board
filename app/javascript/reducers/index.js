import { combineReducers } from 'redux';

import datasets from './datasets';
import workflows from './workflows';

export default combineReducers({
  datasets,
  workflows,
});
