// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import GroupCreatingModal from 'components/molecules/GroupCreatingModal';

export default connect(props, functions)(GroupCreatingModal);
