// @flow
import type {ConnectedFunctions} from './types';
import {goToElementMap, setSingleObject, showEditForm} from 'store/geolocation/actions';

const functions: ConnectedFunctions = {
	goToElementMap,
	setSingleObject,
	showEditForm
};

export {
	functions
};
