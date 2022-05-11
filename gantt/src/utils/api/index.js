// @flow
import Api from './api';
import FakeApi from './fakeApi';
import {
	addNewWork,
	deleteWorkDateRanges,
	editWorkData,
	getAttributeGroups,
	getContext,
	getCurrentUser,
	getDataSourceAttributes,
	getDataSourceAttributesByTypes,
	getDataSources,
	getDiagramData,
	getGanttVersionsSettingsFromDiagramVersionKey,
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
	saveData
} from './context';

export {
	addNewWork,
	deleteWorkDateRanges,
	editWorkData,
	getAttributeGroups,
	getGanttVersionsSettingsFromDiagramVersionKey,
	getWorkAttributes,
	getContext,
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
	saveData
};

export const api = process.env.NODE_ENV === 'development' ? new FakeApi() : new Api();
