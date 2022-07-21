// @flow
import type {AppState} from 'store/types';
import type {ComponentProps, ConnectedFunctions, ConnectedProps} from './types';
import {fetchLinkedAttributes} from 'store/sources/linkedAttributes/actions';
import {getLinkedAttributesKey} from 'store/sources/linkedAttributes/helpers';

export const props = (state: AppState, props: ComponentProps): ConnectedProps => {
	const {value} = props;
	const {dataKey1, dataKey2} = value;
	const classFqn1 = props.data.find(({dataKey}) => dataKey === dataKey1)?.source?.value?.value ?? '';
	const classFqn2 = props.data.find(({dataKey}) => dataKey === dataKey2)?.source?.value?.value ?? '';
	const key = getLinkedAttributesKey(classFqn1, classFqn2);
	const attributes = state.sources.linkedAttributes[key];

	return {attributes};
};

export const functions: ConnectedFunctions = {
	fetchLinkedAttributes
};
