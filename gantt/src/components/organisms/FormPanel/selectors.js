// @flow
import type {AppState} from 'store/types';
import {cancelSettings, changeScale, getGanttData, getVersionSettings, getVersionSettingsAll, saveSettings, setCommonSettings, setRangeTime, setResourceSettings, switchWorkRelationCheckbox} from 'store/App/actions';

const props = (state: AppState) => {
	const {currentInterval, diagramKey, endDate, errorSettings, loadingSettings, progressCheckbox, resources, settings, sources, startDate, versions, workProgresses, workRelationCheckbox} = state.APP;

	return {
		currentInterval,
		diagramKey,
		endDate,
		errorSettings,
		loading: loadingSettings,
		progressCheckbox,
		resources,
		settings,
		sources,
		startDate,
		versions,
		workProgresses,
		workRelationCheckbox
	};
};

const functions = {
	cancelSettings,
	changeScale,
	getGanttData,
	getVersionSettings,
	getVersionSettingsAll,
	saveSettings,
	setCommonSettings,
	setRangeTime,
	setResourceSettings,
	switchWorkRelationCheckbox
};

export {
	functions,
	props
};
