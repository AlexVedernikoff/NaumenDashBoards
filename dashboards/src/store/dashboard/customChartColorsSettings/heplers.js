// @flow
import type {GlobalCustomChartColorsSettings} from 'store/dashboard/customChartColorsSettings/types';
import type {Item, SettingsMap, State} from './types';

/**
 * Возвращает элемент состояния конкретной настройки
 * @param {GlobalCustomChartColorsSettings} data - данные конкретной настройки
 * @returns {Item}
 */
const getItem = (data: GlobalCustomChartColorsSettings = null): Item => ({
	data,
	removing: {
		error: false,
		loading: false
	},
	saving: {
		error: false,
		loading: false
	}
});

/**
 * Возвращает состояние всех настроек
 * @param {SettingsMap} payload - мапа настроек
 * @returns {State}
 */
const getMap = (payload: SettingsMap): State => {
	const map = {};

	Object.keys(payload).forEach(key => {
		map[key] = getItem(payload[key]);
	});

	return map;
};

/**
 * Инициализирует состояние конкретной настройки
 * @returns {Item}
 */
const initItem = (): Item => {
	const item = getItem();

	return {
		...item,
		saving: {
			...item.saving,
			loading: true
		}
	};
};

export {
	getMap,
	initItem
};
