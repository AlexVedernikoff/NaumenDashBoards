// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import IndicatorsDataBox from 'PivotWidgetForm/components/IndicatorsDataBox';

export default connect(props, functions)(IndicatorsDataBox);
