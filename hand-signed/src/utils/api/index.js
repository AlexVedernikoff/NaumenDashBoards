// @flow
import Api from './api';
import FakeApi from './fakeApi';
import {
	getContext,
	getInitialParams,
	getSignature
} from './context';

export {
	getContext,
	getInitialParams,
	getSignature
};

export const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();
