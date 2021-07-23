// @flow
import {connect} from 'react-redux';
import DisplayModeSelectBox from 'WidgetFormPanel/components/DisplayModeSelectBox';
import {props} from './selectors';

export default connect(props)(DisplayModeSelectBox);
