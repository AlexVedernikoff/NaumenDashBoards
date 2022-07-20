// @flow

import type {
	ColorsSettingsDTO,
	ContentParametersDTO,
	ContextObjectDTO,
	CustomGroupData,
	DTOValue,
	DashboardParams,
	EmailUserDTO,
	FilterFormAnswerDTO,
	FilterFormContextDTO,
	FilterFormOptionsDTO,
	SourceFilterDTO,
	UserDTO
} from './types';

export interface FilterFormAPI {
	openForm (descriptor: FilterFormContextDTO, options: FilterFormOptionsDTO): Promise<FilterFormAnswerDTO>;
}

export interface FrameAPI {
	getApplicationCode (): string;
	getContentCode (): string;
	getCurrentContentParameters (): Promise<ContentParametersDTO>;
	getCurrentContextObject (): Promise<ContextObjectDTO>;
	getCurrentLocale (): string;
	getCurrentUser (): UserDTO;
	getSubjectUuid (): string;
	getViewMode(): string;
	openFilterForm (descriptor: FilterFormContextDTO, options: FilterFormOptionsDTO): Promise<DTOValue>;
	restCallAsJson(url: string, options: DTOValue): Promise<DTOValue>;
	restCallModule(module: string, method: string, ...params: Array<DTOValue>): Promise<DTOValue>;
}

export interface WidgetAPI {
	checkToCopy (dashboard: DashboardParams, dashboardKey: string, widgetKey: string): Promise<DTOValue>;
	copyWidget (dashboard: DashboardParams, dashboardKey: string, widgetKey: string): Promise<DTOValue>;
	create (dashboard: DashboardParams, widget: DTOValue): Promise<DTOValue>;
	delete (dashboard: DashboardParams, widgetId: string): Promise<DTOValue>;
	edit (dashboard: DashboardParams, widget: DTOValue): Promise<DTOValue>;
	editChunkData (dashboard: DashboardParams, id: string, widget: DTOValue): Promise<DTOValue>;
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
	delete (dashboard: DashboardParams, customColorKey: string): Promise<DTOValue>;
	save (dashboard: DashboardParams, colorsSettings: ColorsSettingsDTO): Promise<DTOValue>;
}

export interface SourceFiltersAPI {
	check (dashboardKey: string, sourceFilter: SourceFilterDTO): Promise<DTOValue>;
	delete (filterId: string): Promise<DTOValue>;
	getAll (metaClass: string): Promise<DTOValue>;
	save (dashboard: DashboardParams, sourceFilter: SourceFilterDTO): Promise<DTOValue>;
}

export interface CustomGroupAPI {
	delete (dashboard: DashboardParams, groupKey: string): Promise<DTOValue>;
	getAll (dashboardId: string): Promise<DTOValue>;
	getItem (dashboardId: string, groupKey: string): Promise<DTOValue>;
	save (dashboard: DashboardParams, data: CustomGroupData): Promise<DTOValue>;
	update (dashboard: DashboardParams, data: CustomGroupData): Promise<DTOValue>;
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
	getDashboardLink(dashboardId: string, subjectUUID: string): Promise<DTOValue>;
	getDataSourceAttributes(params: DTOValue): Promise<DTOValue>;
	getDataSources(dashboardUUID: string): Promise<DTOValue>;
	getDynamicAttributeGroups(actualDescriptor: DTOValue): Promise<DTOValue>;
	getDynamicAttributes(groupCode: DTOValue): Promise<DTOValue>;
	getLinkedAttributes(parentClassFqn: string, classFqn: string): Promise<DTOValue>;
	getLinkedDataSources(payload: DTOValue): Promise<DTOValue>;
	getMetaClasses(metaClassFqn: string): Promise<DTOValue>;
	getNonMetadataAttributesData(classFqn: string, attrGroupCode: string | null): Promise<DTOValue>;
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
	getLink(payload: DTOValue, subjectUUID: string, type: string, dashboardCode: string, groupCode?: string): Promise<DTOValue>;
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
