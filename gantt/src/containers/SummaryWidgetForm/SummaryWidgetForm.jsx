// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import SummaryWidgetForm from 'components/organisms/SummaryWidgetForm';

export default connect(props, functions)(SummaryWidgetForm);
