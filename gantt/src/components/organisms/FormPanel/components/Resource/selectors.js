// @flow
import {fetchAttributes} from 'store/attributes/actions';

const props = (state: AppState) => {
	const {attributes, resources} = state.APP;
	const {allAttributes} = state.ATTRIBUTES;

	return {
		allAttributes,
		attributes,
		hasMainResource: resources.filter(resource => resource.level === 0).length >= 2
	};
};

const functions = {
	fetchAttributes
};

export {
	functions,
	props
};
