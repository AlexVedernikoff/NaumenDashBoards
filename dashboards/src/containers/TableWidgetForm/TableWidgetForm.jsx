// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import TableWidgetForm from 'components/organisms/TableWidgetForm';

export default connect(props, functions)(TableWidgetForm);
