// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import SourceControl from 'components/organisms/AttributeCreatingModal/components/SourceControl';

export default connect(props, functions)(SourceControl);
