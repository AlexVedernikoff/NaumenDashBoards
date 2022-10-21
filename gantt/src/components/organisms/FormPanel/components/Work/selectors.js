// @flow
import {fetchAttributes, fetchAttributesByTypes, fetchAttributesMilestones} from 'store/attributes/actions';

const props = (state: AppState) => {
	const {attributes} = state.APP;
	const {attributesMilestones} = state.ATTRIBUTES;

	return {
		attributes,
		attributesMilestones
	};
};

const functions = {
	fetchAttributes,
	fetchAttributesByTypes,
	fetchAttributesMilestones
};

export {
	functions,
	props
};
