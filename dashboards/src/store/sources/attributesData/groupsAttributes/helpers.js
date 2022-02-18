// @flow
import {SEPARATED_KEY} from './constants';

const getGroupAttrKey = (classFqn: string, attrGroupCode: string | null): string =>
	classFqn + SEPARATED_KEY + (attrGroupCode ?? '');

export {
	getGroupAttrKey
};
