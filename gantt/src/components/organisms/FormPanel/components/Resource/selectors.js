// @flow
import {fetchAttributes} from 'store/attributes/actions';

const props = (state: AppState) => {
	const {attributes} = state.APP;
	const {allAttributes} = state.ATTRIBUTES;

	return {
		allAttributes,
		attributes
	};
};

const functions = {
	fetchAttributes
};

export {
	functions,
	props
};
