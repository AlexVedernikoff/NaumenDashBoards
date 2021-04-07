// @flow
import {connect} from 'react-redux';
import DataSetSettings from 'TableWidgetForm/components/DataSetSettings';
import {functions, props} from './selectors';

export default connect(props, functions)(DataSetSettings);
