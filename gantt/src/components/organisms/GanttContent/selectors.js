// @flow
import type {AppState} from 'store/types';
import {
	getVersionSettingsAll,
	getWorks,
	switchMilestonesCheckbox,
	switchProgressCheckbox,
	switchStateMilestonesCheckbox,
	switchWorkRelationCheckbox,
	switchWorksWithoutStartOrEndDateCheckbox
} from 'store/App/actions';

const props = (state: AppState) => {
	const {
		diagramKey,
		milestonesCheckbox,
		progressCheckbox,
		stateMilestonesCheckbox,
		workRelationCheckbox,
		worksWithoutStartOrEndDateCheckbox
	} = state.APP;

	return {
		diagramKey,
		milestonesCheckbox,
		progressCheckbox,
		stateMilestonesCheckbox,
		workRelationCheckbox,
		worksWithoutStartOrEndDateCheckbox
	};
};

const functions = {
	getVersionSettingsAll,
	getWorks,
	switchMilestonesCheckbox,
	switchProgressCheckbox,
	switchStateMilestonesCheckbox,
	switchWorkRelationCheckbox,
	switchWorksWithoutStartOrEndDateCheckbox
};

export {
	functions,
	props
};
