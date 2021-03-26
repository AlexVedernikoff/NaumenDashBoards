// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, ContainerProps} from './types';
import {getWidgetGlobalChartColorsSettings} from 'store/dashboard/customChartColorsSettings/selectors';
import {getWidgetsBuildData} from 'store/widgets/data/selectors';
import {removeCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import {setUseGlobalChartSettings} from 'store/widgets/data/actions';

export const props = (state: AppState, props: ContainerProps): ConnectedProps => {
	const {values, widget} = props;

	return {
		buildData: getWidgetsBuildData(state)[widget.id],
		globalColorsSettings: getWidgetGlobalChartColorsSettings(values)(state)
	};
};

export const functions: ConnectedFunctions = {
	removeCustomChartColorsSettings,
	setUseGlobalChartSettings
};
