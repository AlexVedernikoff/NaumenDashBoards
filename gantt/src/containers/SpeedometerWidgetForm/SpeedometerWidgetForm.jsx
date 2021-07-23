// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import SpeedometerWidgetForm from 'components/organisms/SpeedometerWidgetForm';

export default connect(props, functions)(SpeedometerWidgetForm);
