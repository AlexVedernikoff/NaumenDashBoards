// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import RefSelect from 'DiagramWidgetEditForm/components/AttributeFieldset/components/RefSelect';

export default connect(props, functions)(RefSelect);
