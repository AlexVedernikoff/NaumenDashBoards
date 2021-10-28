// @flow
import {ATTRIBUTE_EVENTS} from './constants';

export type AttributesValue = {
	code: string,
	title: string,
	UUID: string
};

export const AttributesTypeList = {
	CHECK: 'CHECK',
	RADIO: 'RADIO'
};

export const AttributesCodeList = {
	checkA15: 'checkA15',
	checkA16: 'checkA16',
	checkA17: 'checkA17',
	checkA19: 'checkA19',
	checkFinServ: 'checkFinServ',
	checkOthers: 'checkOthers',
	checkProperty: 'checkProperty',
	checkStatus: 'checkStatus',
	checkThirdA16: 'checkThirdA16',
	fullCheck: 'fullCheck'
};

export const AttributeValuesMultiSelectCodeList = ['byPostWithoutSign', 'decisionFUAboutSame', 'manyAppalicantsOneFO'];

export type AttributesTypeListKeys = $Keys<AttributesTypeList>;

export type AttributesCodeListKeys = $Keys<AttributesCodeList>;

export type AttributesData = {
	code: AttributesCodeListKeys,
	listType: AttributesTypeListKeys,
	title: boolean,
	typeList: AttributesTypeListKeys,
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
