// @flow
import type {AppState} from 'store/types';
import {deepClone} from 'src/helpers';
import {setResourceSettings} from 'store/App/actions';

const props = (state: AppState) => {
	const {resources, sources} = state.APP;

	return {
		resources: deepClone(resources),
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
