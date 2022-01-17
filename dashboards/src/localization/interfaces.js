// @flow
import type {Locales, LocalizationParams} from './types';

export interface ILocalization {
	addEventChange(func: () => void): void;
	changeLocale(newLocale: Locales): void;
	translate(key: string, params?: LocalizationParams): string;
}

export interface IPluralization {
	axiosLocales(): Object;
	date(val: Date): string;
	number(val: number): string;
	numberAdditional(): Array<string>;
}
