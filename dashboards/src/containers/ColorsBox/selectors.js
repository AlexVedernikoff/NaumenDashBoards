// @flow
import type {AppState} from 'store/types';
import type {ConnectedFunctions, ConnectedProps, OwnerProps} from './types';
import {getCustomColorsSettingsKeyByData} from 'store/widgets/data/helpers';
import {getWidgetsBuildData} from 'store/widgets/data/selectors';
import {removeCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import {setUseGlobalChartSettings} from 'store/widgets/actions';

export const props = (state: AppState, props: OwnerProps): ConnectedProps => {
	const {type, values, widget} = props;
	const key = getCustomColorsSettingsKeyByData(values.data, type.value) ?? '';

	return {
		buildData: getWidgetsBuildData(state)[widget.id],
		globalColorsSettings: state.dashboard.customChartColorsSettings[key]?.data
	};
};

export const functions: ConnectedFunctions = {
	removeCustomChartColorsSettings,
	setUseGlobalChartSettings
};
