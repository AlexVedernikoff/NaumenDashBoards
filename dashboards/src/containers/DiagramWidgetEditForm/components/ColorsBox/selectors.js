// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, ContainerProps} from './types';
import {removeCustomChartColorsSettings, saveCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import {setUseGlobalChartSettings} from 'src/store/widgets/data/actions';

export const props = (state: AppState, props: ContainerProps): ConnectedProps => {
	const {dashboard, widgets} = state;
	const {customChartColorsSettings} = dashboard;
	const {widget} = props;

	return {
		buildData: widgets.buildData[widget.id],
		customChartColorsSettings
	};
};

export const functions: ConnectedFunctions = {
	removeCustomChartColorsSettings,
	saveCustomChartColorsSettings,
	setUseGlobalChartSettings
};
