// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, ContainerProps} from './types';
import {getWidgetBuildData} from 'store/widgets/data/selectors';
import {getWidgetGlobalChartColorsSettings} from 'store/dashboard/customChartColorsSettings/selectors';
import {removeCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import {setUseGlobalChartSettings} from 'src/store/widgets/data/actions';

export const props = (state: AppState, props: ContainerProps): ConnectedProps => {
	const {values, widget} = props;

	return {
		buildData: getWidgetBuildData(widget.id)(state),
		globalColorsSettings: getWidgetGlobalChartColorsSettings(values)(state)
	};
};

export const functions: ConnectedFunctions = {
	removeCustomChartColorsSettings,
	setUseGlobalChartSettings
};
