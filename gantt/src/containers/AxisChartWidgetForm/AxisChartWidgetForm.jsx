// @flow
import AxisChartWidgetForm from 'components/organisms/AxisChartWidgetForm';
import {connect} from 'react-redux';
import {functions, props} from './selectors';

export default connect(props, functions)(AxisChartWidgetForm);
