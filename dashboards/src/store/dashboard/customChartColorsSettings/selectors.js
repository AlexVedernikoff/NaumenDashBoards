// @flow
import type {AppState} from 'store/types';
import {createSelector} from 'reselect';
import {getCustomColorsSettingsKey} from 'store/widgets/data/helpers';
import {hasChartColorsSettings} from 'store/widgets/helpers';
import type {State} from './types';
import type {Widget} from 'store/widgets/data/types';

/**
 * Возвращает данные состояния хранилища настроек цветов
 * @param {AppState} state - состояние хранилища
 * @returns {State}
 */
const getGlobalChartColorsSettings = (state: AppState): State => state.dashboard.customChartColorsSettings;

/**
 * Возвращает настройки цветов виджета
 * @param {Widget} widget - виджет
 * @returns {Function}
 */
const getWidgetGlobalChartColorsSettings = (widget: Widget) => createSelector(
	getGlobalChartColorsSettings,
	(settingsMap): string | null => {
		let settings = null;

		if (hasChartColorsSettings(widget.type)) {
			settings = settingsMap[getCustomColorsSettingsKey(widget)]?.data;
		}

		return settings;
	}
);

export {
	getGlobalChartColorsSettings,
	getWidgetGlobalChartColorsSettings
};
