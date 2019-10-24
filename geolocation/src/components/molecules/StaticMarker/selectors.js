// @flow
import type {ConnectedProps} from './types';
import type {AppState} from 'store/types';

const props = (state: AppState): ConnectedProps => ({
	color: state.geolocation.params.colorStaticPoint
});

export {
	props
};
