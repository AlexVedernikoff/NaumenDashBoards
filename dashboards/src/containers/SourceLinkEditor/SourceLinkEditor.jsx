// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import SourceLinkEditor from 'PivotWidgetForm/components/SourceLinksBox/components/SourceLinkEditor';

export default connect(props, functions)(SourceLinkEditor);
