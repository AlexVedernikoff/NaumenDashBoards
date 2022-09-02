// @flow
import type {AppState} from 'store/types';
import {
	cancelSettings,
	changeScale,
	deleteGanttVersionSettings,
	getGanttData,
	getVersionSettings,
	getVersionSettingsAll,
	saveSettings,
	savedGanttVersionSettings,
	setCommonSettings,
	setCurrentVersion,
	setListVersions,
	setRangeTime,
	setResourceSettings,
	switchWorkRelationCheckbox
} from 'store/App/actions';

const props = (state: AppState) => {
	const {
		currentInterval,
		diagramKey,
		endDate,
		errorSettings,
		loadingSettings,
		mandatoryAttributes,
		milestonesCheckbox,
		progressCheckbox,
		resources,
		settings,
		sources,
		startDate,
		stateMilestonesCheckbox,
		versionKey,
		versions,
		workProgresses,
		workRelationCheckbox,
		worksWithoutStartOrEndDateCheckbox
	} = state.APP;

	return {
		currentInterval,
		diagramKey,
		endDate,
		errorSettings,
		loading: loadingSettings,
		mandatoryAttributes,
		milestonesCheckbox,
		progressCheckbox,
		resources,
		settings,
		sources,
		startDate,
		stateMilestonesCheckbox,
		versionKey,
		versions,
		workProgresses,
		workRelationCheckbox,
		worksWithoutStartOrEndDateCheckbox
	};
};

const functions = {
	cancelSettings,
	changeScale,
	deleteGanttVersionSettings,
	getGanttData,
	getVersionSettings,
	getVersionSettingsAll,
	saveSettings,
	savedGanttVersionSettings,
	setCommonSettings,
	setCurrentVersion,
	setListVersions,
	setRangeTime,
	setResourceSettings,
	switchWorkRelationCheckbox
};

export {
	functions,
	props
};
