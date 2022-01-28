// @flow
import type {AppState} from 'store/types';
import {cancelSettings, changeScale, saveSettings, setCommonSettings, setRangeTime, setResourceSettings} from 'store/App/actions';

const props = (state: AppState) => {
	const {diagramKey, endDate, errorSettings, loadingSettings, resources, settings, sources, startDate} = state.APP;

	return {
		diagramKey,
		endDate,
		errorSettings,
		loading: loadingSettings,
		resources,
		settings,
		sources,
		startDate
	};
};

const functions = {
	cancelSettings,
	changeScale,
	saveSettings,
	setCommonSettings,
	setRangeTime,
	setResourceSettings
};

export {
	functions,
	props
};
