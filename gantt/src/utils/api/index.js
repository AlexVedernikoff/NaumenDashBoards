// @flow
import Api from './api';
import FakeApi from './fakeApi';
import {
	addNewWork,
	deleteWorkDateRanges,
	deleteGanttVersionSettingsRequest,
	editWorkData,
	editWorkDateRangesFromVersionRequest,
	getAttributeGroups,
	getContext,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getGanttVersionsSettings,
	getInitialParams,
	getInitialSettings,
	getUserData,
	getWorkAttributes,
	getWorkPageLink,
	openFilterForm,
	postChangedWorkInterval,
	postChangedWorkProgress,
	postChangedWorkRelations,
	getGanttVersionTitlesAndKeys,
	saveData,
	saveGanttVersionSettingsRequest
} from './context';

export {
	addNewWork,
	deleteWorkDateRanges,
	deleteGanttVersionSettingsRequest,
	editWorkData,
	getAttributeGroups,
	getContext,
	getGanttVersionsSettings,
	getWorkAttributes,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getInitialParams,
	getInitialSettings,
	getUserData,
	getWorkPageLink,
	openFilterForm,
	postChangedWorkRelations,
	postChangedWorkInterval,
	postChangedWorkProgress,
	getGanttVersionTitlesAndKeys,
	saveData,
	saveGanttVersionSettingsRequest,
	editWorkDateRangesFromVersionRequest
};

export const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();
