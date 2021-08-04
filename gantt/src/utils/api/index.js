// @flow
import Api from './api';
import FakeApi from './fakeApi';
import {
	getContext,
	getDataSources,
	getInitialParams,
	getInitialSettings
} from './context';

export {
	getContext,
	getDataSources,
	getInitialParams,
	getInitialSettings
};

export const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();
