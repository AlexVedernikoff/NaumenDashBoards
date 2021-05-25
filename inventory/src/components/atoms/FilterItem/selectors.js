// @flow
import type {ConnectedFunctions, ConnectedProps} from './types';
import {toggleGroup} from 'store/geolocation/actions';

const props = (): ConnectedProps => {
	return {};
};

const functions: ConnectedFunctions = {
	toggleGroup
};

export {
	functions,
	props
};
