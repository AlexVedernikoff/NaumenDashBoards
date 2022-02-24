// @flow
import Api from './api';
import FakeApi from './fakeApi';
import {
	getAttributeGroups,
	getContext,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getInitialParams,
	getInitialSettings,
	getUserData,
	openFilterForm,
	postChangeProgress,
	saveData
} from './context';

export {
	getAttributeGroups,
	getContext,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getInitialParams,
	getInitialSettings,
	getUserData,
	openFilterForm,
	postChangeProgress,
	saveData
};

export const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();
