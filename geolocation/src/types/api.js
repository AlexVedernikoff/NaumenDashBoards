// @flow
export type Module =
	| 'mapRest';

export type Method =
	| 'getCurrentContextObject'
	| 'getLastGeopositions'
	| 'getPoints';

export type Context = {
	contentCode: string,
	subjectUuid: string
};
