// @flow
import {ATTRIBUTES_EVENTS} from './constants';
import {buildUrl, client} from 'utils/api';
import type {Dispatch, ThunkAction} from 'store/types';
import type {TreeSelectValue} from 'components/molecules/TreeSelectInput/types';

/**
 * Получаем атрибуты конкретного класса
 * @param {TreeSelectValue} source - выбранное значение в дереве источников
 * @returns {ThunkAction}
 */
const fetchAttributes = (source: TreeSelectValue): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const classFqn = source.value;
	dispatch(requestAttributes(classFqn));
	try {
		const {data} = await client.post(buildUrl('dashboards', 'getAttributesDataSources', `'${classFqn}'`));
		const notBreakdown = {
			...data[0],
			title: 'Без разбивки',
			type: '',
			code: ''
		};
		const newData = data.reduce((acc, el) => [...acc, { ...el, sourceName: el.label }], [notBreakdown]);

		dispatch(receiveAttributes(newData, classFqn));
	} catch (error) {
		dispatch(recordAttributesError(classFqn));
	}
};

const requestAttributes = (payload: string) => ({
	type: ATTRIBUTES_EVENTS.REQUEST_ATTRIBUTES,
	payload
});

const receiveAttributes = (attributes, classFqn) => ({
	type: ATTRIBUTES_EVENTS.RECEIVE_ATTRIBUTES,
	payload: {attributes, classFqn}
});

const recordAttributesError = (payload: string) => ({
	type: ATTRIBUTES_EVENTS.RECORD_ATTRIBUTES_ERROR,
	payload
});

export {
	fetchAttributes
};
