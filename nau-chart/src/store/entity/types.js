// @flow
import type {VERIFY_EVENTS} from './constants';

export type ActionType = 'open_link' | 'change_responsible' | 'change_state';

export type Action = {
	inPlace?: boolean,
	link: string,
	name: string,
	states?: string[],
	type: ActionType
};

export type Presentation = 'full_length' | 'right_of_label' | 'under_label';

export type ValueType = {
	label: string,
	url: string
};

export type Option = {
	label?: string,
	presentation: Presentation,
	value: string | ValueType
};

export type Entity = {
	actions?: Action[],
	desc: string,
	editFormCode: string,
	from: string | null,
	header: string,
	icon: string,
	id: string,
	options?: Option[],
	roundLayout?: boolean,
	title: string,
	to: string | null,
	type: string,
	uuid: string | null
};

export type DefaultLocationPoints = {
	uuid: string,
	x: number,
	y: number
};

export type ViewData = {
	creatorView: string,
	label: string,
	value: string
};

export type ListViews = {
	generalViews: {
		viewData: ViewData[]
	},
	personalView: {
		defaultSchemaKey: string,
		viewData: ViewData[]
	}
};

export type EntityState = {
	activeElement: Entity | null,
	centerPointUuid: string,
	data: Entity[],
	dataDefaultLocationPoints: DefaultLocationPoints[],
	dataDefaultView: ViewData | null,
	editingGlobal: boolean,
	error: boolean,
	exportTo: string,
	listViews: ListViews,
	loading: boolean,
	position: {x: number, y: number},
	scale: number,
	searchObjects: [],
	searchText: string,
	setting: {
		popupSaveViews: boolean,
		popupSettingViews: boolean
	}
};

export type EntityAction = {
	objects: Entity[],
	payload: null,
	text: string,
	type: $Keys<typeof VERIFY_EVENTS>,
	uuid: string
};
