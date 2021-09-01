// @flow
import {fetchAttributes, fetchAttributesByTypes} from 'store/attributes/actions';

const props = (state: AppState) => {
	const {attributes} = state.APP;

	return {
		attributes
	};
};

const functions = {
	fetchAttributes,
	fetchAttributesByTypes
};

export {
	functions,
	props
};
