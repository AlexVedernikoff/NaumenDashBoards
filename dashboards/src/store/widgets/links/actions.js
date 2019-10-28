// @flow
import {buildUrl, client} from 'utils/api';
import {createOrderName, WIDGET_VARIANTS} from 'utils/widget';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import type {DrillDownMixin, ReceiveLinkPayload} from './types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {LINKS_EVENTS} from './constants';
import type {Widget} from 'store/widgets/data/types';

const getPartsClassFqn = (classFqn: ?string) => {
	const cases = [];

	if (classFqn && classFqn.includes('$')) {
		const parts = classFqn.split('$');
		classFqn = parts.shift();
		cases.push(parts.pop());
	}

	return {
		cases,
		classFqn
	};
};

const createCommonPostData = (widget: Widget) => {
	const {descriptor, diagramName: title, source} = widget;
	const baseClassFqn = source && source.value;

	const {cases, classFqn} = getPartsClassFqn(baseClassFqn);

	return {
		attrCodes: null,
		cases,
		classFqn,
		descriptor,
		title
	};
};

const createCompositePostData = (widget: Widget) => {
	const {diagramName: title, order} = widget;

	if (Array.isArray(order)) {
		const firstNumber = order[0];
		const source = widget[createOrderName(firstNumber)(FIELDS.source)];
		const descriptor = widget[createOrderName(firstNumber)(FIELDS.descriptor)];
		const baseClassFqn = source && source.value;

		const {cases, classFqn} = getPartsClassFqn(baseClassFqn);

		return {
			attrCodes: null,
			cases,
			classFqn,
			descriptor,
			title
		};
	}

	return {};
};

/**
 * Создание ссылки для перехода на данные диаграммы
 * @param {Widget} widget - данные виджета
 * @param {DrillDownMixin} mixin - примесь данных (создается при выборе конкретного элемента графика)
 * @returns {Function}
 */
const drillDown = (widget: Widget, mixin: ?DrillDownMixin): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;
	const type = widget.type.value;

	const creator = [SUMMARY, TABLE].includes(type) ? createCompositePostData : createCommonPostData;
	let postData = creator(widget);

	if (mixin && typeof mixin === 'object') {
		postData = {...postData, ...mixin};
	}

	dispatch(getLink(widget.id, postData));
};

/**
 * Создание ссылки для перехода на данные комбо диаграммы
 * @param {Widget} widget - данные виджета
 * @param {number} orderNum - порядковый номер выбранного источника
 * @returns {Function}
 */
const comboDrillDown = (widget: Widget, orderNum: number): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const source = widget[createOrderName(orderNum)(FIELDS.source)];
	const descriptor = widget[createOrderName(orderNum)(FIELDS.descriptor)];

	if (source) {
		const {label, value} = source;
		const {cases, classFqn} = getPartsClassFqn(value);

		const postData = {
			attrCodes: null,
			cases,
			classFqn,
			descriptor,
			title: label
		};

		dispatch(getLink(widget.id, postData));
	}
};

/**
 * Получаем ссылку по отправленным данным и открываем ее в новом окне
 * @param {string} id - индетификатор виджета
 * @param {object} postData - данные для построения ссылки
 * @returns {Function}
 */
const getLink = (id: string, postData: Object): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {links} = getState().widgets;
	let link = links[id];

	if (!link) {
		dispatch(requestLink(id));
		try {
			const {data} = await client.post(buildUrl('dashboardDrilldown', 'getLink', 'requestContent'), postData);
			link = data;
			dispatch(
				receiveLink({link, id})
			);
		} catch (e) {
			dispatch(recordLinkError(id));
		}
	}

	link && window.open(link);
};

const requestLink = (payload: string) => ({
	type: LINKS_EVENTS.REQUEST_LINK,
	payload
});

const receiveLink = (payload: ReceiveLinkPayload) => ({
	type: LINKS_EVENTS.RECEIVE_LINK,
	payload
});

const recordLinkError = (payload: string) => ({
	type: LINKS_EVENTS.RECORD_LINK_ERROR,
	payload
});

export {
	comboDrillDown,
	drillDown
};
