// @flow
import type {CustomChartColorsSettingsData} from 'store/widgets/data/types';
import type {Item, SettingsMap, State} from './types';

/**
 * Возвращает элемент состояния конкретной настройки
 * @param {CustomChartColorsSettingsData | undefined} data - данные конкретной настройки
 * @returns {Item}
 */
const getItem = (data?: CustomChartColorsSettingsData): Item => ({
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
	const map = {...payload};

	Object.keys(map).forEach(key => {
		map[key] = getItem(map[key]);
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
