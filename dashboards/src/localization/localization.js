// @flow
import {DEFAULT_LOCALE, FETCH_STATUS, LOCALES} from './constants';
import type {ILocalization, IPluralization} from './interfaces';
import type {LocaleData, Locales, LocalizationParams, PlurizationItem, Subscriber} from './types';

class Localization implements ILocalization {
	status = FETCH_STATUS.IDLE;
	locale = DEFAULT_LOCALE;
	localeData: LocaleData = {};
	pluralization: IPluralization;
	subscribers: Subscriber[] = [];

	constructor () {
		this.loadLocalize();
	}

	addEventChange (func: Subscriber) {
		this.subscribers.push(func);

		if (this.status === FETCH_STATUS.SUCCESS) {
			func(this.locale);
		}
	}

	changeLocale (newLocale: Locales = DEFAULT_LOCALE): void {
		this.locale = newLocale;
		this.loadLocalize();
	}

	async loadLocalize () {
		this.status = FETCH_STATUS.FETCHING;

		try {
			switch (this.locale) {
				case LOCALES.EN:
					this.localeData = (await import('./json/en.json'));
					this.pluralization = (await import('./pluralization/en')).default;
					break;
				case LOCALES.RU:
					this.localeData = (await import('./json/ru.json'));
					this.pluralization = (await import('./pluralization/ru')).default;
					break;
				case LOCALES.DE:
					this.localeData = (await import('./json/de.json'));
					this.pluralization = (await import('./pluralization/de')).default;
					break;
				case LOCALES.PL:
					this.localeData = (await import('./json/pl.json'));
					this.pluralization = (await import('./pluralization/pl')).default;
					break;
				default:
					throw new Error('Undefined language');
			}
			this.status = FETCH_STATUS.SUCCESS;
			this.subscribers.forEach((func) => func(this.locale));
		} catch (exception) {
			if (process.env.NODE_ENV === 'development') {
				console.error(exception);
			}

			this.status = FETCH_STATUS.FAIL;
		}
	}

	translateString (value: string, params?: LocalizationParams): string {
		let result = value;

		if (params) {
			// eslint-disable-next-line no-unused-vars
			for (const name in params) {
				const regexp = new RegExp(`\\{${name}\\}`, 'g');
				let val = params[name];

				if (typeof val === 'number') {
					val = this.pluralization.number(val);
				}

				if (typeof val === 'object' && val instanceof Date) {
					val = this.pluralization.date(val);
				}

				result = value.replace(regexp, val);
			}
		}

		return result;
	}

	translatePlurization (value: PlurizationItem, params?: LocalizationParams): string {
		let result = '';
		const {data, func: funcName} = value;
		const objPluralization = (this.pluralization: Object);

		if (funcName in objPluralization) {
			const func = objPluralization[funcName];

			if (typeof func === 'function') {
				result = func(data, params);
				result = this.translateString(result, params);
			}
		}

		return result;
	}

	translate (key: string, params?: LocalizationParams): string {
		let result = key;

		if (key in this.localeData) {
			result = this.localeData[key];

			if (typeof result === 'string') {
				result = this.translateString(result, params);
			}

			if (typeof result === 'object') {
				result = this.translatePlurization(result, params);
			}
		}

		return result;
	}
}

export default Localization;
