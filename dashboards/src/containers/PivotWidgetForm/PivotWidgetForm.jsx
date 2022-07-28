// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PivotWidgetForm from 'components/organisms/PivotWidgetForm';

export default connect(props, functions)(PivotWidgetForm);
