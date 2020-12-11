// @flow
import {isObject} from 'src/helpers';
import {setLocalStorageValue} from 'store/helpers';
import type {StorageSettings as StorageSettingsType, StorageSettingsKey, StorageSettingsValue} from './types';
import {STORAGE_SETTINGS_KEYS} from './constants';

/** Управляет настройками дашборда, которые хранятся в localStorage */
class StorageSettings {
	/** Код дашборда */
	code: string = '';
	/** Настройки дашборда */
	settings: StorageSettingsType = {};

	/**
	 * Принимает код дашборда, сохраняет его как переменную и по полученному коду инициализирует сохраненные настройки
	 * @param {string} code - код дашборда
	 */
	constructor (code: string) {
		this.code = code;
		const rawSettings = localStorage.getItem(code);

		if (rawSettings) {
			const settings = JSON.parse(rawSettings);

			if (isObject(settings)) {
				this.settings = settings;
			}
		}
	}

	/**
	 * Очищает настройки
	 * @returns {void}
	 */
	clear = () => localStorage.removeItem(this.code);

	/**
	 * Возвращает настройки дашборда
	 * @returns {StorageSettingsType}
	 */
	getSettings = (): StorageSettingsType => this.settings;

	/**
	 * Сохраняет значение фокуса дашборда. Если focus - true, при загрузке приложения производится
	 * фокусировка на текущий дашборд
	 * @param {boolean} value - значение фокуса дашборда,
	 * @returns {void}
	 */
	setFocus = (value: boolean) => this.setValue(STORAGE_SETTINGS_KEYS.FOCUSED, value);

	/**
	 * Сохраняет идентификатор виджета, для дальнейшей фокусировки при загрузке приложения
	 * @param {string} value - уникальный идентификатор виджета
	 * @returns {void}
	 */
	setTargetWidget = (value: string) => this.setValue(STORAGE_SETTINGS_KEYS.TARGET_WIDGET, value);

	/**
	 * Сохраняет значение настроек дашборда в localStorage
	 * @param {StorageSettingsKey} key - ключ
	 * @param {StorageSettingsValue} value - значение
	 * @returns {void}
	 */
	setValue = (key: StorageSettingsKey, value: StorageSettingsValue) => {
		setLocalStorageValue(this.code, key, value);
	};
}

export default StorageSettings;
