// @flow
import type {AppState} from 'store/types';
import {setResourceSettings} from 'store/App/actions';

const props = (state: AppState) => {
	const {resources, sources} = state.APP;

	return {
		resources,
		sources
	};
};

const functions = {
	setResourceSettings
};

export {
	functions,
	props
};
