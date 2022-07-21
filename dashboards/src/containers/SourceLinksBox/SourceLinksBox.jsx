// @flow
import {connect} from 'react-redux';
import {props} from './selectors';
import SourceLinksBox from 'PivotWidgetForm/components/SourceLinksBox';

export default connect(props)(SourceLinksBox);
