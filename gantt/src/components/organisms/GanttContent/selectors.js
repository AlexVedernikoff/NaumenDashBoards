// @flow
import type {AppState} from 'store/types';
import {switchProgressCheckbox, switchWorkRelationCheckbox} from 'store/App/actions';

const props = (state: AppState) => {
	const {progressCheckbox, workRelationCheckbox} = state.APP;

	return {
		progressCheckbox,
		workRelationCheckbox
	};
};

const functions = {
	switchProgressCheckbox,
	switchWorkRelationCheckbox
};

export {
	functions,
	props
};
