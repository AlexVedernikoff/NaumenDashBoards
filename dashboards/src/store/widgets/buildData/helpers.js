// @flow
import type {AnyWidget, SourceData, Widget} from 'store/widgets/data/types';
import type {BuildDataState, DataSetDescriptorRelation} from './types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

/**
 * Возвращает значение представления без переданного кода
 * @param {string} value - значение представления
 * @param {string} separator - разделитель лейбла и кода
 * @returns {string}
 */
const getSeparatedLabel = (value: string, separator: string): string => value.split(separator)[0];

/**
 * Обновляем/сбрасываем данные по виджету при его редактировании
 *
 * @param   {BuildDataState}  state  - хранилище данных виджетов
 * @param   {Widget} widget - виджет для редактирования
 *
 * @returns  {BuildDataState} - новое хранилище данных виджетов
 */
const updateWidgetData = (state: BuildDataState, widget: Widget): BuildDataState => {
	const {id} = widget;

	if (id in state) {
		const data = state[id];

		if (data.type !== widget.type) {
			return {
				...state,
				[id]: {
					data: null,
					error: false,
					loading: false,
					type: widget.type
				}
			};
		}
	}

	return state;
};

/**
 * Получение расширеных дескрипторов для источника
 * @param {object} dataSet - источник
 * @returns  {Array<DataSetDescriptorRelation>} - расширеные дескрипторы
 */
const getDataSetFilterOptionsDescriptors = (dataSet: {dataKey: string, source: SourceData}): Array<DataSetDescriptorRelation> => {
	const {dataKey, source: {widgetFilterOptions}} = dataSet;
	const result = [];

	widgetFilterOptions && widgetFilterOptions.forEach(({descriptor}) => {
		if (descriptor) {
			result.push({dataKey, descriptor});
		}
	});

	return result;
};

/**
 * Получение расширеных дескрипторов для виджета
 * @param {AnyWidget}  widget - Виджет
 * @returns  {Array<DataSetDescriptorRelation>} - расширеные дескрипторы
 */
const getWidgetFilterOptionsDescriptors = (widget: AnyWidget): Array<DataSetDescriptorRelation> => {
	if (widget.type !== WIDGET_TYPES.TEXT) {
		const {data} = widget;
		return data.map(getDataSetFilterOptionsDescriptors).flat();
	}

	return [];
};

export {
	getSeparatedLabel,
	getWidgetFilterOptionsDescriptors,
	updateWidgetData
};
