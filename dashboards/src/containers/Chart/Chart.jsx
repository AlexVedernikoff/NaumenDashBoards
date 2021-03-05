// @flow
import Chart from 'components/molecules/Chart';
import {connect} from 'react-redux';
import {props} from './selectors';

export default connect(props)(Chart);
