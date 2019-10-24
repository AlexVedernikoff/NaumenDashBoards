// @flow
import type {ConnectedProps, OwnProps} from './types';
import type {AppState} from 'store/types';

const props = (state: AppState, props: OwnProps): ConnectedProps => ({
	color: state.geolocation.params.colorStaticPoint,
	count: props.marker.data.length
});

export {
	props
};
