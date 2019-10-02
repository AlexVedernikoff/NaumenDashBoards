// @flow
import {connect} from 'react-redux';
import LayoutGrid from 'components/molecules/LayoutGrid/LayoutGrid';
import {props} from './selectors';

export default connect(props)(LayoutGrid);
