// @flow
import cn from 'classnames';
import {debounce} from 'src/helpers';
import type {DivRef} from 'components/types';
import {getLayoutWidgets} from 'src/store/widgets/helpers';
import {GRID_PROPS} from './constants';
import isMobile from 'ismobilejs';
import type {Layout, Layouts} from 'store/dashboard/layouts/types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props} from 'containers/DashboardContent/types';
import React, {Component, createRef} from 'react';
import {ResizeDetector, Widget} from 'components/molecules';
import {Responsive as Grid} from 'react-grid-layout';
import type {State, WidgetRef} from './types';
import styles from './styles.less';
import type {Widget as WidgetType} from 'store/widgets/data/types';
import WidgetAddPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';

export const gridRef: DivRef = createRef();

export class DashboardContent extends Component<Props, State> {
	gridContainerRef: DivRef = createRef();
	newWidgetRef: WidgetRef = createRef();
	state = {
		newWidgetFocused: false,
		width: null
	};

	componentDidUpdate () {
		this.setFocusOnNewWidget();
	}

	handleGridToggle = (show: boolean) => () => {
		const {current: grid} = gridRef;

		if (grid) {
			grid.classList.toggle(styles.drawnGrid, show);
		}
	};

	handleLayoutChange = (layout: Layout, layouts: Layouts) => {
		const {changeLayouts, layoutMode} = this.props;

		changeLayouts({
			layoutMode,
			layouts
		});
	};

	handleWidgetSelect = (widgetId: string) => {
		const {selectWidget, selectedWidget} = this.props;

		if (widgetId !== selectedWidget) 	{
			selectWidget(widgetId);
		}
	};

	isDesktopMK = () => {
		const {layoutMode} = this.props;
		return !isMobile().any && layoutMode === LAYOUT_MODE.MOBILE;
	};

	setFocusOnNewWidget = () => {
		const {current: grid} = gridRef;
		const {current: newWidget} = this.newWidgetRef;
		const {current: container} = this.gridContainerRef;
		const {newWidgetFocused} = this.state;

		if (newWidget && container && grid && !newWidgetFocused) {
			container && container.scrollTo(0, grid.clientHeight);
			this.setState(() => ({newWidgetFocused: true}));
		} else if (!newWidget && newWidgetFocused) {
			this.setState(() => ({newWidgetFocused: false}));
		}
	};

	setGridWidth = () => {
		const {current} = this.gridContainerRef;

		if (current) {
			const {paddingLeft, paddingRight} = getComputedStyle(current);
			const width: number = Math.round(current.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight));

			this.setState({width});
		}
	};

	renderGrid = () => {
		const {layoutMode, layouts, selectedWidget, widgets} = this.props;
		const {width} = this.state;

		if (width) {
			const isEditable = !!selectedWidget;
			const containerWidth = this.isDesktopMK() ? 320 : width;
			const layoutWidgets = getLayoutWidgets(widgets, layoutMode);

			return (
				<Grid
					innerRef={gridRef}
					isDraggable={isEditable}
					isResizable={isEditable}
					layouts={layouts}
					onDrag={this.handleGridToggle(true)}
					onDragStop={this.handleGridToggle(false)}
					onLayoutChange={debounce(this.handleLayoutChange, 1000)}
					width={containerWidth}
					{...GRID_PROPS[layoutMode]}
				>
					{layoutWidgets.map(this.renderWidget)}
				</Grid>
			);
		}
	};

	renderGridWithContainer = () => {
		const {editMode} = this.props;
		const containerCN = cn({
			[styles.editModeContainer]: editMode,
			[styles.viewModeContainer]: !editMode,
			[styles.containerMk]: this.isDesktopMK()
		});

		return (
			<ResizeDetector onResize={this.setGridWidth}>
				<div className={containerCN} ref={this.gridContainerRef}>
					{this.renderGrid()}
				</div>
			</ResizeDetector>
		);
	};

	renderRightPanel = () => {
		const {editMode, selectedWidget} = this.props;

		if (editMode) {
			return (
				<div className={styles.panel}>
					{selectedWidget ? <WidgetFormPanel key={selectedWidget} /> : <WidgetAddPanel />}
				</div>
			);
		}
	};

	renderWidget = (widget: WidgetType) => {
		const {
			buildData,
			drillDown,
			editWidgetChunkData,
			editable,
			fetchBuildData,
			layoutMode,
			personalDashboard,
			removeWidget,
			selectedWidget,
			updateWidget,
			user
		} = this.props;
		const {displayMode, id} = widget;
		const isNew = id === NewWidget.id;
		const ref = isNew ? this.newWidgetRef : null;

		return (
			<Widget
				buildData={buildData[id]}
				data={widget}
				displayMode={displayMode}
				editWidgetChunkData={editWidgetChunkData}
				fetchBuildData={fetchBuildData}
				isEditable={editable}
				isNew={isNew}
				isSelected={selectedWidget === widget.id}
				key={id}
				layoutMode={layoutMode}
				onDrillDown={drillDown}
				onEdit={this.handleWidgetSelect}
				onRemove={removeWidget}
				onUpdate={updateWidget}
				personalDashboard={personalDashboard}
				ref={ref}
				user={user}
			/>
		);
	};

	render () {
		return (
			<div className={styles.content}>
				{this.renderGridWithContainer()}
				{this.renderRightPanel()}
			</div>
		);
	}
}

export default DashboardContent;
