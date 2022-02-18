// @flow

// TODO: Удалить. DTOValue - временное решение, до той поры, когда мы опишем все DTO типы
// eslint-disable-next-line no-unused-vars
export type DTOValue = Object;

export type Transport = (module: string, method: string, ...params: Array<DTOValue>) => Promise<DTOValue>;

export type ApiConfig = {
	driver: string,
};

export type DashboardParams = {
	classFqn: string,
	contentCode: string,
	editable: boolean,
	isPersonal: boolean
};

export type FilterFormAnswerDTO = {
	serializedContext: string
};

export type FilterFormContextDTO = {
	attrCodes?: Array<string>,
	attrGroupCode?: string,
	cases?: Array<string>,
	clazz?: string
};

export type ContentParametersDTO = {
	editable: Array<string>,
	MinTimeIntervalUpdate: number | null
};

export type ContextObjectDTO = {
	card_caption: string,
	dashboardCode: string,
	metaClass: string,
	UUID: string,
};

export type UserDTO = {
	admin: boolean,
	licensed: boolean,
	login: string,
	roles: Array<string>,
	title: string,
	uuid: string
};

export type CustomGroupData = {
	id: string,
	name: string,
	subGroups: Array<DTOValue>,
	type: string,
};

export type ColorsSettingsDTO = {
	colors: Array<DTOValue>,
	defaultColor: string,
	key: string
};

export type SourceFilterDTO = {
	descriptor: string,
	id: ?string,
	label: string,
	value: string,
};

export type EmailUserDTO = {
	email: string,
	name?: string
};

export type ExecErrorResponse = {
	responseText: string,
	status: number,
	statusText: string
};

export type FilterFormOptionsDTO = {
	restriction: {[fqn: string]: string} | null,
	useRestriction: boolean
};
