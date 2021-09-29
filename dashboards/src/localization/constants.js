// @flow
const RU: 'ru' = 'ru';
const EN: 'en' = 'en';
const DE: 'de' = 'de';
const PL: 'pl' = 'pl';

export const DEFAULT_LOCALE = RU;

export const LOCALES = {
	DE,
	EN,
	PL,
	RU
};

const IDLE: 'IDLE' = 'IDLE';
const FETCHING: 'FETCHING' = 'FETCHING';
const SUCCESS: 'SUCCESS' = 'SUCCESS';
const FAIL: 'FAIL' = 'FAIL';

export const FETCH_STATUS = {
	FAIL,
	FETCHING,
	IDLE,
	SUCCESS
};
