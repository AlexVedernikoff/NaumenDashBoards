// @flow
import {connect} from 'react-redux';
import DataSourceInput from 'components/molecules/DataSourceInput';
import {functions, props} from './selectors';

export default connect(props, functions)(DataSourceInput);
