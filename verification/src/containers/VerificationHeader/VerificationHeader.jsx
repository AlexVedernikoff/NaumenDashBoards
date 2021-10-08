// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import VerificationHeader from 'components/organisms/VerificationHeader';

export default connect(props, functions)(VerificationHeader);
