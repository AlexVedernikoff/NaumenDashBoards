// @flow
import {connect} from 'react-redux';
import {props} from './selectors';
import VerificationContent from 'components/organisms/VerificationContent';

export default connect(props)(VerificationContent);
