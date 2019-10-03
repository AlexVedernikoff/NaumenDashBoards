// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import Geolocation from 'components/organisms/Geolocation';

export default connect(props, functions)(Geolocation);
