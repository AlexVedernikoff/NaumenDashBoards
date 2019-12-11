// @flow
import AutoUpdateForm from 'components/organisms/AutoUpdateForm';
import config from './config';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import {withFormik} from 'formik';

const FormikAutoUpdateForm = withFormik(config)(AutoUpdateForm);

export default connect(props, functions)(FormikAutoUpdateForm);
