// @flow
import {connect} from 'react-redux';
import ExportByEmailForm from 'components/organisms/ExportByEmailForm';
import {functions, props} from './selectors';

export default connect(props, functions)(ExportByEmailForm);
