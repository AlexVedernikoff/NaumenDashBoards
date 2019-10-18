// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import LayoutGrid from 'components/organisms/LayoutGrid';

export default connect(props, functions)(LayoutGrid);
