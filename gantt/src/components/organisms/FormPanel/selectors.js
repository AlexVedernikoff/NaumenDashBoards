// @flow
import type {AppState} from 'store/types';
import {cancelSettings, changeScale, saveSettings, setCommonSettings, setRangeTime, setResourceSettings, switchWorkRelationCheckbox} from 'store/App/actions';

const props = (state: AppState) => {
	const {diagramKey, endDate, errorSettings, loadingSettings, progressCheckbox, resources, settings, sources, startDate, workProgresses, workRelationCheckbox} = state.APP;

	return {
		diagramKey,
		endDate,
		errorSettings,
		loading: loadingSettings,
		progressCheckbox,
		resources,
		settings,
		sources,
		startDate,
		workProgresses,
		workRelationCheckbox
	};
};

const functions = {
	cancelSettings,
	changeScale,
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
