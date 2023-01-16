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
		isPersonal,
		milestonesCheckbox,
		progressCheckbox,
		stateMilestonesCheckbox,
		workRelationCheckbox,
		worksWithoutStartOrEndDateCheckbox,
		user
	} = state.APP;

	return {
		diagramKey,
		isPersonal,
		milestonesCheckbox,
		progressCheckbox,
		stateMilestonesCheckbox,
		workRelationCheckbox,
		user,
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
