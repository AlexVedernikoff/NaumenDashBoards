// @flow
export type Module =
	| 'mapRest';

export type Method =
	| 'getCurrentContextObject'
	| 'getCurrentGeopositions'
	| 'getPoints';

export type Context = {
	contentCode: string,
	subjectUuid: string
};
