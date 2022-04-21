// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps, WidgetProps} from './types';
import {drillDown} from 'store/widgets/links/actions';
import {fetchBuildData} from 'store/widgets/buildData/actions';
import {getWidgetBuildData} from 'store/widgets/data/selectors';
import {getWidgetGlobalChartColorsSettings} from 'store/dashboard/customChartColorsSettings/selectors';
import {setWarningMessage} from 'store/widgets/data/actions';

export const props = (state: AppState, props: WidgetProps): ConnectedProps => {
	const {widget} = props;

	return {
		buildData: getWidgetBuildData(state, widget),
		globalColorsSettings: getWidgetGlobalChartColorsSettings(widget)(state)
	};
};

export const functions = {
	drillDown,
	fetchBuildData,
	setWarningMessage
};