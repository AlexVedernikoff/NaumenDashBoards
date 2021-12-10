// @flow
import {LOCALES} from './constants';

export type Locales = $Values<typeof LOCALES>;

export type LocalizationParams = {[id: string]: string | number | Date};

export type PluralizationItemParams = Object;

export type PluralizationItem = {
	data: string | string[] | PluralizationItemParams,
	func: string
};

export type LocalItem = string | PluralizationItem;

export type PluralizationFunc = (data: LocalItem, params?: LocalizationParams) => string;

export type Pluralization = {[funcName: string]: PluralizationFunc};

export type Subscriber = (locale: Locales) => void;

export type LocaleData = {[key: string]: LocalItem };
