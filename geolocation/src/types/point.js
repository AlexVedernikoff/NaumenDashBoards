// @flow
import type {Action} from './action';
import type {Geoposition} from './geoposition';
import type {Option} from './option';

export type Point = {
	actions?: Array<Action>,
	errorMessage?: string,
	geoposition: Geoposition,
	header: string,
	options?: Array<Option>,
	type: 'dynamic' | 'static',
	uuid?: string
};
