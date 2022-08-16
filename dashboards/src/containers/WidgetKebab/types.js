// @flow
import type {AnyWidget, PivotWidget, TableWidget, Widget} from 'store/widgets/data/types';
import type {DrillDownAction} from 'store/widgets/links/types';
import type {Ref} from 'components/types';
import type {ThunkAction} from 'store/types';

export type Option = {
	label: string,
	value: string | number | Symbol
};

export type DropDownParams = {
	availableOptions: Array<Option>,
	icon: string,
	text: string,
	value: ?string
};

export type NavigationProps = {
	text: ?string
};

export type NavigationData = {
	dashboard: string,
	id: string
};

export type FiltersOnWidget = {
	options: Array<Option>,
	selected: ?string
};

export type ConnectedProps = {
	data: ?DropDownParams,
	editable: boolean,
	exportParams: ?DropDownParams,
	filtersOnWidget: ?DropDownParams,
	mode: ?DropDownParams,
	navigation: ?NavigationProps,
	personalDashboard: boolean,
};

export type ConnectedFunctions = {
	drillDown: DrillDownAction,
	editWidgetChunkData: (widget: AnyWidget, chunkData: Object) => ThunkAction,
	exportPivotToXLSX: (widget: PivotWidget) => ThunkAction,
	exportTableToXLSX: (widget: TableWidget) => ThunkAction,
	openNavigationLink: (dashboardId: string, widgetId: string) => ThunkAction,
	removeWidgetWithConfirm: (widgetId: string) => ThunkAction,
	saveWidgetWithNewFilters: (widget: Widget) => ThunkAction,
	selectWidget: (widgetId: string) => ThunkAction,
};

export type OwnProps = {
	className: string,
	widget: AnyWidget,
	widgetRef: Ref<'div'>
};

export type State = {
	diagramWidget: ?Widget
};

export type Props = ConnectedFunctions & ConnectedProps & OwnProps;
