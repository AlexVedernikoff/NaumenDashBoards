// @flow
import {ATTRIBUTE_EVENTS} from './constants';

export type AttributesValue = {
	title: string,
	UUID: string,
};

export type AttributesData = {
	code: string,
	title: boolean,
	values: AttributesValue[],
};

export type AttributesAction = {
	payload: null,
	type: typeof ATTRIBUTE_EVENTS.EMPTY_DATA,
};

export type AttributesState = {
	attributes: AttributesData[],
	error: boolean,
	loading: boolean,
};
