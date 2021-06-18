// @flow
import AttributeGroupField from 'components/organisms/WidgetFormPanel/components/AttributeGroupField';
import {connect} from 'react-redux';
import {functions} from './selectors';

export default connect(null, functions)(AttributeGroupField);
