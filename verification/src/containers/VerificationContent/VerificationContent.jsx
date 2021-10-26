// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import VerificationContent from 'components/organisms/VerificationContent';

export default connect(props, functions)(VerificationContent);
