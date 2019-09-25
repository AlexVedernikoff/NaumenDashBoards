// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import WidgetAddingPanel from 'components/organisms/WidgetAddPanel';

export default connect(props, functions)(WidgetAddingPanel);
