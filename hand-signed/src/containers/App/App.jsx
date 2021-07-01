// @flow
import App from 'components/App';
import {connect} from 'react-redux';
import {functions} from './selectors';

export default connect(null, functions)(App);
