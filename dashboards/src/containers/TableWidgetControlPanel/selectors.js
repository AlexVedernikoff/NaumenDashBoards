// @flow
import type {AppState} from 'src/store/types';
import type {ConnectedProps, Props} from './types';

export const props = (state: AppState, props: Props): ConnectedProps => ({
	data: state.widgets.buildData[props.widget.id]?.data
});
