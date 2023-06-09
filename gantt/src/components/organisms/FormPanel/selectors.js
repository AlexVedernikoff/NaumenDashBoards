// @flow
import type {AppState} from 'store/types';
import {
	cancelSettings,
	changeScale,
	deleteGanttVersionSettings,
	getGanttData,
	getVersionSettings,
	getVersionSettingsAll,
	saveDataCurrentVersion,
	saveSettings,
	savedGanttVersionSettings,
	setCommonSettings,
	setCurrentVersion,
	setListVersions,
	setRangeTime,
	setResourceSettings,
	switchWorkRelationCheckbox,
	switchWorksWithoutStartOrEndDateCheckbox
} from 'store/App/actions';
import {
	fetchAttributesMilestones
} from 'store/attributes/actions';

const props = (state: AppState) => {
	const {
		attributes,
		currentInterval,
		diagramKey,
		endDate,
		errorSettings,
		loadingSettings,
		milestonesCheckbox,
		multiplicityCheckbox,
		progressCheckbox,
		resources,
		settings,
		sources,
		startDate,
		stateMilestonesCheckbox,
		textPositionCheckbox,
		versionKey,
		versions,
		viewOfNestingCheckbox,
		workProgresses,
		workRelationCheckbox,
		worksWithoutStartOrEndDateCheckbox
	} = state.APP;

	return {
		attributes,
		currentInterval,
		diagramKey,
		endDate,
		errorSettings,
		loading: loadingSettings,
		milestonesCheckbox,
		multiplicityCheckbox,
		progressCheckbox,
		resources,
		settings,
		sources,
		startDate,
		stateMilestonesCheckbox,
		textPositionCheckbox,
		versionKey,
		versions,
		viewOfNestingCheckbox,
		workProgresses,
		workRelationCheckbox,
		worksWithoutStartOrEndDateCheckbox
	};
};

const functions = {
	cancelSettings,
	changeScale,
	deleteGanttVersionSettings,
	fetchAttributesMilestones,
	getGanttData,
	getVersionSettings,
	getVersionSettingsAll,
	saveDataCurrentVersion,
	saveSettings,
	savedGanttVersionSettings,
	setCommonSettings,
	setCurrentVersion,
	setListVersions,
	setRangeTime,
	setResourceSettings,
	switchWorkRelationCheckbox,
	switchWorksWithoutStartOrEndDateCheckbox
};

export {
	functions,
	props
};
