// @flow
import type {AppState} from 'store/types';
import {getVersionSettingsAll, switchProgressCheckbox, switchWorkRelationCheckbox} from 'store/App/actions';

const props = (state: AppState) => {
	const {diagramKey, progressCheckbox, workRelationCheckbox} = state.APP;

	return {
		diagramKey,
		progressCheckbox,
		workRelationCheckbox
	};
};

const functions = {
	getVersionSettingsAll,
	switchProgressCheckbox,
	switchWorkRelationCheckbox
};

export {
	functions,
	props
};
