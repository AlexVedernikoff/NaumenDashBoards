// @flow
import {LOCALES} from './constants';

export type Locales = $Values<typeof LOCALES>;

export type LocalizationParams = {[id: string]: string | number | Date};

export type PlurizationItemParams = Object;

export type PlurizationItem = {
	data: string | string[] | PlurizationItemParams,
	func: string
};

export type LocalItem = string | PlurizationItem;

export type PluralisationFunc = (data: LocalItem, params?: LocalizationParams) => string;

export type Pluralisations = {[funcName: string]: PluralisationFunc};

export type Subscriber = (locale: Locales) => void;

export type LocaleData = {[key: string]: LocalItem };
