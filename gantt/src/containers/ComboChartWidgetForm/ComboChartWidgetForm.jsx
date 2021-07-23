// @flow
import ComboChartWidgetForm from 'components/organisms/ComboChartWidgetForm';
import {connect} from 'react-redux';
import {functions, props} from './selectors';

export default connect(props, functions)(ComboChartWidgetForm);
