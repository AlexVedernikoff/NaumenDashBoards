// @flow
import {connect} from 'react-redux';
import DocumentVerifyContent from 'components/organisms/DocumentVerifyContent';
import {functions, props} from './selectors';

export default connect(props, functions)(DocumentVerifyContent);
