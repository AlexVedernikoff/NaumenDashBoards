import {connect} from 'react-redux';
import {functions, props} from './selectors';
import MainSelectList from 'DiagramWidgetEditForm/components/AttributeFieldset/components/MainSelectList';

export default connect(props, functions)(MainSelectList);
