// @flow
import AutoUpdateButton from 'components/organisms/AutoUpdateButton';
import {connect} from 'react-redux';
import {functions, props} from './selectors';

export default connect(props, functions)(AutoUpdateButton);
