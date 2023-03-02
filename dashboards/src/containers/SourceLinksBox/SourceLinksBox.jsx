// @flow
import {compose} from 'redux';
import {connect} from 'react-redux';
import {props} from './selectors';
import SourceLinksBox from 'PivotWidgetForm/components/SourceLinksBox';
import withErrors from 'components/organisms/WidgetForm/HOCs/withErrors';

export default compose(connect(props), withErrors)(SourceLinksBox);
