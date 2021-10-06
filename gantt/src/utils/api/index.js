// @flow
import Api from './api';
import FakeApi from './fakeApi';
import {
	getContext,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getInitialParams,
	getInitialSettings,
	getUserData,
	openFilterForm,
	saveData
} from './context';

export {
	getContext,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getInitialParams,
	getInitialSettings,
	getUserData,
	openFilterForm,
	saveData
};

export const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();
