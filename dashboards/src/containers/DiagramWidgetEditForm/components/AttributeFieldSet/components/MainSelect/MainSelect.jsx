// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import MainSelect from 'DiagramWidgetEditForm/components/AttributeFieldset/components/MainSelect';

export default connect(props, functions)(MainSelect);
