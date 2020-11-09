// @flow
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {DrillDownMixin} from './types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getDescriptorCases} from 'src/helpers';
import {isSourceType} from 'store/sources/data/helpers';
import {LINKS_EVENTS} from './constants';
import type {Widget} from 'store/widgets/data/types';

const getPartsClassFqn = (code?: string) => {
	const cases = [];
	let classFqn = code;

	if (classFqn && isSourceType(classFqn)) {
		cases.push(...getDescriptorCases(classFqn).map(type => type.split('$')[1]));
		classFqn = classFqn.split('$')[0];
	}

	return {
		cases,
		classFqn
	};
};

const createPostData = (widget: Widget, index: number) => {
	let postData = {};
	const set = widget.data[index];
	const source = set[FIELDS.source];
	const descriptor = set[FIELDS.descriptor];

	if (source) {
		const {label: title, value} = source;
		const {cases, classFqn} = getPartsClassFqn(value);

		postData = {
			cases,
			classFqn,
			descriptor,
			title
		};
	}

	return postData;
};

/**
 * Преобразует ссылку к относительному виду. Необходимо для корректной работы
 * @param {string} link - абсолютная ссылка [http://nordclan-dev2.nsd.naumen.ru/sd/operator/?anchor=list:!!encoded_prms=encoded_text$99466589]
 * @returns {string} - относительная ссылка [/sd/operator/?anchor=list:!!encoded_prms=encoded_text$99466589]
 */
const getRelativeLink = (link: string): string => link.replace(/^(.+?)\?/, '/sd/operator/?');

/**
 * Создание ссылки для перехода на данные диаграммы
 * @param {Widget} widget - данные виджета
 * @param {number} index - индекс набора данных массива data виджета
 * @param {DrillDownMixin} mixin - примесь данных (создается при выборе конкретного элемента графика)
 * @returns {Function}
 */
const drillDown = (widget: Widget, index: number, mixin: ?DrillDownMixin): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	let postData = createPostData(widget, index);

	if (mixin && typeof mixin === 'object') {
		postData = {...postData, ...mixin};
	}

	dispatch(openObjectsList(widget.id, postData));
};

/**
 * Открывает список объектов
 * @param {string} id - индетификатор виджета
 * @param {object} payload - данные для построения ссылки
 * @returns {ThunkAction}
 */
const openObjectsList = (id: string, payload: Object): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {context} = getState();
	const {subjectUuid} = context;

	dispatch(requestLink(id));
	try {
		const {link} = await window.jsApi.restCallModule('dashboardDrilldown', 'getLink', payload, subjectUuid);

		window.open(getRelativeLink(link));
		dispatch(receiveLink(id));
	} catch (e) {
		dispatch(recordLinkError(id));
	}
};

/**
 * Открывает карточку объекта по переданному значению объекта
 * @param {string} value - значение объекта
 * @returns {ThunkAction}
 */
const openCardObject = (value: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	dispatch(requestLink(value));

	try {
		const {link} = await window.jsApi.restCallModule('dashboards', 'getCardObject', value);

		window.open(getRelativeLink(link));
		dispatch(receiveLink(value));
	} catch (e) {
		dispatch(recordLinkError(value));
	}
};

const requestLink = (payload: string) => ({
	payload,
	type: LINKS_EVENTS.REQUEST_LINK
});

const receiveLink = (payload: string) => ({
	payload,
	type: LINKS_EVENTS.RECEIVE_LINK
});

const recordLinkError = (payload: string) => ({
	payload,
	type: LINKS_EVENTS.RECORD_LINK_ERROR
});

export {
	drillDown,
	openCardObject
};
