// @flow
import CircleChartWidgetForm from 'components/organisms/CircleChartWidgetForm';
import {connect} from 'react-redux';
import {functions, props} from './selectors';

export default connect(props, functions)(CircleChartWidgetForm);
