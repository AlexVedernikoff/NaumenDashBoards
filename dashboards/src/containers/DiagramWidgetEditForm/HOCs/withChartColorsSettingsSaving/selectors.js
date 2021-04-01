// @flow
import type {ConnectedFunctions} from './types';
import {saveCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/actions';
import {setUseGlobalChartSettings} from 'store/widgets/data/actions';

export const functions: ConnectedFunctions = {
	saveCustomChartColorsSettings,
	setUseGlobalChartSettings
};
