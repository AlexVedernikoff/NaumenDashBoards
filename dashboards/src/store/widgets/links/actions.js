// @flow
import api from 'api';
import type {Dispatch, GetState, ThunkAction} from 'store/types';
import {DrillDownBigData} from 'api/errors';
import type {DrillDownMixin} from './types';
import {getPartsClassFqn} from './helpers';
import {LINKS_EVENTS} from './constants';
import {parseAttrSetConditions} from 'store/widgetForms/helpers';
import {setWarningMessage} from 'store/widgets/data/actions';
import StorageSettings from 'utils/storageSettings';
import type {Widget} from 'store/widgets/data/types';

const createPostData = (widget: Widget, index: number) => {
	let postData = {};
	const {dataKey, source} = widget.data[index];
	const {descriptor, filterId, value: sourceValue, widgetFilterOptions} = source;

	if (source) {
		const {label: title, value} = sourceValue;
		const {cases, classFqn} = getPartsClassFqn(value);
		const widgetFilters = widgetFilterOptions?.filter(({descriptor}) => !!descriptor).map(({descriptor}) => ({ dataKey, descriptor })) ?? [];

		postData = {
			cases,
			classFqn,
			descriptor,
			filterId,
			title,
			widgetFilters
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
const drillDown = (widget: Widget, index: number, mixin: ?DrillDownMixin): ThunkAction =>
	async (dispatch: Dispatch, getState: GetState): Promise<void> => {
		const {isMobileDevice} = getState().dashboard.settings;

		if (!isMobileDevice) {
			let postData = createPostData(widget, index);

			if (mixin && typeof mixin === 'object') {
				postData = {...postData, ...mixin};
			}

			dispatch(openObjectsList(widget, postData));
		}
	};
/**
 * Открывает список объектов
 * @param {Widget} widget - данные виджета
 * @param {object} payload - данные для построения ссылки
 * @returns {ThunkAction}
 */
const openObjectsList = (widget: Widget, payload: Object): ThunkAction => async (dispatch: Dispatch, getState: GetState): Promise<void> => {
	const {context, dashboard} = getState();
	const {subjectUuid} = context;
	const {id, type} = widget;
	const {groupCode = ''} = parseAttrSetConditions(payload) ?? {};

	dispatch(requestLink(id));
	try {
		const {link} = await api.instance.drillDown.getLink(payload, subjectUuid, type, dashboard.settings.code, groupCode);

		window.open(getRelativeLink(link));
		dispatch(receiveLink(id));
	} catch (exception) {
		if (exception instanceof DrillDownBigData) {
			dispatch(setWarningMessage({id, message: 'Детализация данных не доступна. Слишком большое количество данных'}));
			return;
		}

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
		const {link} = await api.instance.dashboards.getCardObject(value);

		window.open(getRelativeLink(link));
		dispatch(receiveLink(value));
	} catch (e) {
		dispatch(recordLinkError(value));
	}
};

/**
 * Открывает дашборд по переданному идентификатору и сохраняет идентификатор виджета, для последующего фокуса.
 * @param {string} dashboardId - уникальный идентификатор дашборда
 * @param {string} widgetId - уникальный идентификатор виджета
 * @returns {ThunkAction}
 */
const openNavigationLink = (dashboardId: string, widgetId: string): ThunkAction => async (dispatch: Dispatch): Promise<void> => {
	const storageSettings = new StorageSettings(dashboardId);

	widgetId ? storageSettings.setTargetWidget(widgetId) : storageSettings.setFocus(true);
	dispatch(requestLink(dashboardId));

	try {
		const {link} = await api.instance.dashboards.getDashboardLink(dashboardId);

		window.open(getRelativeLink(link));
		dispatch(receiveLink(dashboardId));
	} catch (e) {
		dispatch(recordLinkError(dashboardId));
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
	openCardObject,
	openNavigationLink,
	recordLinkError
};
