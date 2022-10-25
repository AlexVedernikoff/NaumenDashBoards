// @flow
import api from 'api';
import {
	changeFiltersOnWidget,
	clearFiltersOnWidget,
	exportScreenShot,
	getDataForNavigation,
	parseDiagramWidget
} from './helpers';
import {CLEAR_FILTER} from './constants';
import {connect} from 'react-redux';
import {DIAGRAM_WIDGET_TYPES} from 'store/widgets/data/constants';
import type {DivRef} from 'components/types';
import {FILE_VARIANTS} from 'utils/export';
import {functions, props} from './selectors';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import WidgetKebab from 'components/organisms/Widget/components/WidgetKebab/WidgetKebab';

export class WidgetKebabContainer extends PureComponent<Props, State> {
	state = {
		diagramWidget: null,
		needToCloseFilterForm: false
	};

	static getDerivedStateFromProps (props, state) {
		const {widget} = props;
		return {
			diagramWidget: parseDiagramWidget(widget)
		};
	}

	componentWillUnmount () {
		const {needToCloseFilterForm} = this.state;

		if (needToCloseFilterForm) {
			api.instance.filterForm.closeForm();
		}
	}

	handleChangeFiltersOnWidget = async filter => {
		const {saveWidgetWithNewFilters} = this.props;
		const {diagramWidget} = this.state;
		const {value} = filter;
		let newWidget = null;

		this.setState({needToCloseFilterForm: true});

		if (diagramWidget) {
			if (typeof value === 'string') {
				newWidget = await changeFiltersOnWidget(diagramWidget, value);
			} else if (value === CLEAR_FILTER) {
				newWidget = clearFiltersOnWidget(diagramWidget);
			}
		}

		if (newWidget) {
			await saveWidgetWithNewFilters(newWidget);
		}

		this.setState({needToCloseFilterForm: false});
	};

	handleChangeMode = ({value: displayMode}) => {
		const {editWidgetChunkData, widget} = this.props;

		editWidgetChunkData(widget, {displayMode});
	};

	handleDrillDown = ({value}) => {
		const {drillDown} = this.props;
		const {diagramWidget} = this.state;

		if (typeof value === 'number' && diagramWidget) {
			drillDown(diagramWidget, value);
		}
	};

	handleExport = (element: HTMLDivElement, format: $Keys<typeof FILE_VARIANTS>) => {
		const {exportPivotToXLSX, exportTableToXLSX} = this.props;
		const {diagramWidget} = this.state;

		if (diagramWidget) {
			if (format === FILE_VARIANTS.XLSX) {
				if (diagramWidget.type === DIAGRAM_WIDGET_TYPES.TABLE) {
					exportTableToXLSX(diagramWidget);
				} else if (diagramWidget.type === DIAGRAM_WIDGET_TYPES.PIVOT_TABLE) {
					exportPivotToXLSX(diagramWidget);
				}
			} else {
				exportScreenShot(diagramWidget, format);
			}
		}
	};

	handleNavigation = () => {
		const {openNavigationLink, widget} = this.props;

		const navigation = getDataForNavigation(widget);

		if (navigation) {
			const {dashboard, id} = navigation;

			openNavigationLink(dashboard, id);
		}
	};

	handleRemove = (relativeElement?: DivRef) => {
		const {removeWidgetWithConfirm, widget} = this.props;

		removeWidgetWithConfirm(widget.id, relativeElement);
	};

	handleSelect = () => {
		const {selectWidget, widget} = this.props;

		selectWidget(widget.id);
	};

	render () {
		return (
			<WidgetKebab
				{...this.props}
				onChangeFiltersOnWidget={this.handleChangeFiltersOnWidget}
				onChangeMode={this.handleChangeMode}
				onDrillDown={this.handleDrillDown}
				onExport={this.handleExport}
				onNavigation={this.handleNavigation}
				onRemove={this.handleRemove}
				onSelect={this.handleSelect}
			/>
		);
	}
}

export default connect(props, functions)(WidgetKebabContainer);
