// @flow
import type {BuildDataState} from './types';
import type {Widget} from 'store/widgets/data/types';

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

export {
	getSeparatedLabel,
	updateWidgetData
};
