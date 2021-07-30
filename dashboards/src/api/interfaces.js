// @flow

import type {
	ColorsSettingsDTO,
	ContentParametersDTO,
	ContextObjectDTO,
	CustomGroupData,
	DTOValue,
	DashbordParams,
	EmailUserDTO,
	FilterFormAnswerDTO,
	FilterFormDescriptorDTO,
	SourceFilterDTO,
	UserDTO
} from './types';

export interface FilterFormAPI {
	openForm (descriptor: FilterFormDescriptorDTO, useAttrFilter?: boolean): Promise<FilterFormAnswerDTO>;
}

export interface FrameAPI {
	getContentCode (): string;
	getCurrentContentParameters (): Promise<ContentParametersDTO>;
	getCurrentContextObject (): Promise<ContextObjectDTO>;
	getCurrentUser (): UserDTO;
	getSubjectUuid (): string;
}

export interface WidgetAPI {
	checkToCopy (dashboard: DashbordParams, dashboardKey: string, widgetKey: string): Promise<DTOValue>;
	copyWidget (dashboard: DashbordParams, dashboardKey: string, widgetKey: string): Promise<DTOValue>;
	create (dashboard: DashbordParams, widget: DTOValue): Promise<DTOValue>;
	delete (dashboard: DashbordParams, widgetId: string): Promise<DTOValue>;
	edit (dashboard: DashbordParams, widget: DTOValue): Promise<DTOValue>;
	editChunkData (dashboard: DashbordParams, id: string, widget: DTOValue): Promise<DTOValue>;
}

export interface SettingsDataAPI {
	editLayouts (payload: DTOValue): Promise<DTOValue>;
	getDashboardsAndWidgetsTree (): Promise<DTOValue>;
	getSettings (payload: DTOValue): Promise<DTOValue>;
	getUserData (payload: DTOValue): Promise<DTOValue>;
	getUsers (): Promise<DTOValue>;
	saveAutoUpdate (payload: DTOValue): Promise<DTOValue>;
}

export interface CustomColorsAPI {
	delete (dashboard: DashbordParams, customColorKey: string): Promise<DTOValue>;
	save (dashboard: DashbordParams, colorsSettings: ColorsSettingsDTO): Promise<DTOValue>;
}

export interface SourceFiltersAPI {
	check (dashboardKey: string, sourceFilter: SourceFilterDTO): Promise<DTOValue>;
	delete (filterId: string): Promise<DTOValue>;
	getAll (metaClass: string): Promise<DTOValue>;
	save (dashboard: DashbordParams, sourceFilter: SourceFilterDTO): Promise<DTOValue>;
}

export interface CustomGroupAPI {
	delete (dashboard: DashbordParams, groupKey: string): Promise<DTOValue>;
	getAll (dashboardId: string): Promise<DTOValue>;
	getItem (dashboardId: string, groupKey: string): Promise<DTOValue>;
	save (dashboard: DashbordParams, data: CustomGroupData): Promise<DTOValue>;
	update (dashboard: DashbordParams, data: CustomGroupData): Promise<DTOValue>;
}

export interface PersonalDashboardAPI {
	create(classFqn: string, contentCode: string, editable: boolean): Promise<DTOValue>;
	delete(subjectUUID: string, contentCode: string): Promise<DTOValue>;
}

export interface DashboardSettingsAPI {
	customColors: CustomColorsAPI,
	customGroup: CustomGroupAPI,
	personalDashboard: PersonalDashboardAPI,
	settings: SettingsDataAPI,
	sourceFilters: SourceFiltersAPI,
	widget: WidgetAPI
}

export interface DashboardsAPI {
	checkForParent(mainValue: string, value: string): Promise<DTOValue>;
	getAttributeObject(request: DTOValue): Promise<DTOValue>;
	getAttributesFromLinkAttribute(request: DTOValue): Promise<DTOValue>;
	getCardObject(value: DTOValue): Promise<DTOValue>;
	getCatalogItemObject(property: DTOValue): Promise<DTOValue>;
	getCatalogObject(property: DTOValue): Promise<DTOValue>;
	getDashboardLink(dashboardId: string): Promise<DTOValue>;
	getDataSourceAttributes(params: DTOValue): Promise<DTOValue>;
	getDataSources(): Promise<DTOValue>;
	getDynamicAttributeGroups(actualDescriptor: DTOValue): Promise<DTOValue>;
	getDynamicAttributes(groupCode: DTOValue): Promise<DTOValue>;
	getLinkedDataSources(payload: DTOValue): Promise<DTOValue>;
	getMetaClasses(metaClassFqn: string): Promise<DTOValue>;
	getStates(metaClassFqn: string): Promise<DTOValue>;
	searchValue(request: DTOValue): Promise<DTOValue>;
}

export interface FileToMailAPI {
	send (key: string, type: string, name: string, users: Array<EmailUserDTO>): Promise<DTOValue>;
}

export interface DashboardDataSetAPI {
	getDataForCompositeDiagram(
		dashboardId: string,
		widgetId: string,
		subjectUUID: string,
		widgetFilters: Array<DTOValue>
	): Promise<DTOValue>;

	getDataForTableDiagram(
		dashboardId: string,
		widgetId: string,
		subjectUUID: string,
		requestData: DTOValue,
		widgetFilters: Array<DTOValue>
	): Promise<DTOValue>;
}

export interface DrillDownAPI {
	getLink(payload: DTOValue, subjectUUID: string, type: string, dashboardCode: string): Promise<DTOValue>;
}

export interface API {
	dashboardDataSet: DashboardDataSetAPI,
	dashboards: DashboardsAPI,
	dashboardSettings: DashboardSettingsAPI,
	drillDown: DrillDownAPI,
	fileToMail: FileToMailAPI,
	filterForm: FilterFormAPI,
	frame: FrameAPI
}
