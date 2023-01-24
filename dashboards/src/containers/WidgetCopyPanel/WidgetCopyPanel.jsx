// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import WidgetCopyPanel from 'components/organisms/WidgetCopyPanel';

export default connect(props, functions)(WidgetCopyPanel);
