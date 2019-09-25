// @flow
import config from './config';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import WidgetFormPanel from 'components/organisms/WidgetFormPanel';
import {withFormik} from 'formik';

const FormikWidgetFormPanel = withFormik(config)(WidgetFormPanel);

export default connect(props, functions)(FormikWidgetFormPanel);
