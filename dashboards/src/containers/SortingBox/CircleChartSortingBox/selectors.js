// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';

export const props = (state: AppState): ConnectedProps => ({
	values: state.widgetForms.circleChartForm
});
