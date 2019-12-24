// @flow
import {buildUrl, client} from 'utils/api';
import {createOrdinalName} from 'utils/widget';
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

const createLegacyPostData = (widget: Widget) => {
	const {descriptor, diagramName: title, source} = widget;
	const baseClassFqn = source && source.value;
	const {cases, classFqn} = getPartsClassFqn(baseClassFqn);

	return {
		cases,
		classFqn,
		descriptor,
		title
	};
};

const createPostData = (widget: Widget, ordinalNumber: number) => {
	let postData = {};
	const source = widget[createOrdinalName(FIELDS.source, ordinalNumber)];
	const descriptor = widget[createOrdinalName(FIELDS.descriptor, ordinalNumber)];

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
 * Создание ссылки для перехода на данные диаграммы
 * @param {Widget} widget - данные виджета
 * @param {number} ordinalNumber - порядковый номер выбранного источника
 * @param {DrillDownMixin} mixin - примесь данных (создается при выборе конкретного элемента графика)
 * @returns {Function}
 */
const drillDown = (widget: Widget, ordinalNumber?: number, mixin: ?DrillDownMixin): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	let postData = ordinalNumber ? createPostData(widget, ordinalNumber) : createLegacyPostData(widget);
	let key = widget.id;

	if (mixin && typeof mixin === 'object') {
		postData = {...postData, ...mixin};
	}

	if (ordinalNumber) {
		key = `${key}_${widget[createOrdinalName(FIELDS.dataKey, ordinalNumber)]}`;
	}

	dispatch(getLink(key, postData));
};

/**
 * Получаем ссылку по отправленным данным и открываем ее в новом окне
 * @param {string} id - индетификатор виджета
 * @param {object} postData - данные для построения ссылки
 * @returns {Function}
 */
const getLink = (id: string, postData: Object): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {dashboard, widgets} = getState();
	const {subjectUuid} = dashboard.context;
	const {links} = widgets;
	let link = links[id];

	if (!link) {
		dispatch(requestLink(id));
		try {
			const {data} = await client.post(buildUrl('dashboardDrilldown', 'getLink', `requestContent,'${subjectUuid}'`), postData);
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
	drillDown
};
