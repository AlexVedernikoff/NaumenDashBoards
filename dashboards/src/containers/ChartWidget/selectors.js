// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import {getWidgetGlobalChartColorsSettings} from 'store/dashboard/customChartColorsSettings/selectors';
import type {Props} from 'components/molecules/Chart/types';

export const props = (state: AppState, props: Props): ConnectedProps => {
	const {widget} = props;

	return {
		globalColorsSettings: getWidgetGlobalChartColorsSettings(widget)(state)
	};
};
