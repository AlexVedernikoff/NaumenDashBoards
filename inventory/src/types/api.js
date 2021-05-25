// @flow
export type Module =
	| 'mapRest';

export type Method =
	| 'getCurrentContextObject'
	| 'getLastGeopositions'
	| 'getMap';

export type Context = {
	contentCode: string,
	subjectUuid: string
};
