// @flow
import {connect} from 'react-redux';
import DataSourceInput from 'components/molecules/DataSourceInput';
import {props} from './selectors';

export default connect(props)(DataSourceInput);
