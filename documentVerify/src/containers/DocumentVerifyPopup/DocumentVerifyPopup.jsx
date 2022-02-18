// @flow
import {connect} from 'react-redux';
import DocumentVerifyPopup from 'components/organisms/DocumentVerifyPopup';
import {functions, props} from './selectors';

export default connect(props, functions)(DocumentVerifyPopup);
