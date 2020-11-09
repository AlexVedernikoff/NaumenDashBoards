// @flow
import {connect} from 'react-redux';
import Form from 'components/organisms/DiagramWidgetEditForm';
import {functions, props} from './selectors';

export default connect(props, functions)(Form);
