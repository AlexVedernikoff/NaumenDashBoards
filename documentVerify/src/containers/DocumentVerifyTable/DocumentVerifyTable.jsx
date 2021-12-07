// @flow
import {connect} from 'react-redux';
import DocumentVerifyTable from 'components/organisms/DocumentVerifyTable';
import {functions, props} from './selectors';

export default connect(props, functions)(DocumentVerifyTable);
