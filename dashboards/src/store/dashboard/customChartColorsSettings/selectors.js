// @flow
import type {AppState} from 'store/types';
import {createSelector} from 'reselect';
import {CUSTOM_CHART_COLORS_SETTINGS_TYPES} from 'store/widgets/data/constants';
import {getCustomColorsSettingsKey} from 'store/widgets/data/helpers';
import {hasBreakdown, hasChartColorsSettings} from 'store/widgets/helpers';
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
	settingsMap => {
		let settings = null;

		if (hasChartColorsSettings(widget.type)) {
			const globalSettings = settingsMap[getCustomColorsSettingsKey(widget)]?.data;

			if (!hasBreakdown(widget) || globalSettings?.type === CUSTOM_CHART_COLORS_SETTINGS_TYPES.BREAKDOWN) {
				settings = globalSettings;
			}
		}

		return settings;
	}
);

export {
	getGlobalChartColorsSettings,
	getWidgetGlobalChartColorsSettings
};
