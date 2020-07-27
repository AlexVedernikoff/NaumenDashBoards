// @flow
import {BREAKPOINTS, COLS, ROW_HEIGHT} from './constants';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {getLayoutWidgets} from 'src/store/widgets/helpers';
import isMobile from 'ismobilejs';
import type {Layout} from 'utils/layout/types';
import {LAYOUT_MODE} from 'store/dashboard/constants';
import {NewWidget} from 'utils/widget';
import type {Props} from 'containers/DashboardContent/types';
import React, {Component, createRef} from 'react';
import {Responsive as Grid} from 'react-grid-layout';
import type {State, WidgetRef} from './types';
import styles from './styles.less';
import {Widget} from 'components/molecules';
import type {Widget as WidgetType} from 'store/widgets/data/types';
import WidgetAddPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';

export const gridRef: DivRef = createRef();

export class DashboardContent extends Component<Props, State> {
	gridContainerRef: DivRef = createRef();
	newWidgetRef: WidgetRef = createRef();
	onDragged: boolean = false;
	state = {
		newWidgetFocused: false,
		width: null
	};

	/**
	 * Для использования адаптивности библиотеки "react-grid-layout",
	 * необходимо указать точную ширину рабочей области. Обернув компонент Layout
	 * в обычный div, у нас появляется возможность, после первичного рендера, взять его ширину
	 * и пробросить ее в дочерний компонент, тем самым задав сетке виджетов оптимальную ширину.
	 */
	componentDidMount () {
		const {current: gridContainer} = gridRef;

		if (gridContainer) {
			const width: number = gridContainer.clientWidth;

			this.setState({width});
			window.addEventListener('resize', this.reloadGrid);
		}
	}

	componentDidUpdate () {
		this.setFocusOnNewWidget();
	}

	getContainerClassName = () => {
		const {editMode} = this.props;

		return cn({
			[styles.editModeContainer]: editMode,
			[styles.viewModeContainer]: !editMode,
			[styles.containerMk]: this.isDesktopMK()
		});
	};

	getWidgets = () => {
		const {newWidget, widgets} = this.props;

		if (newWidget) {
			return [...widgets, newWidget];
		}

		return widgets;
	};

	handleLayoutChange = (layout: Layout) => {
		const {editLayout, layoutMode} = this.props;
		editLayout(layout, layoutMode);
	};

	handleShowGrid = (show: boolean) => () => {
		const {current: grid} = gridRef;
		this.onDragged = show;

		if (grid) {
			setTimeout(() => {
				if (this.onDragged === show) {
					// $FlowFixMe
					grid.firstChild.classList.toggle(styles.drawnGrid, show);
				}
			}, 150);
		}
	};

	handleWidgetSelect = (widgetId: string) => {
		const {selectWidget, selectedWidget} = this.props;

		if (widgetId !== selectedWidget) 	{
			selectWidget(widgetId);
		}
	};

	isDesktopMK = () => {
		const {layoutMode} = this.props;
		return !isMobile().any && layoutMode === LAYOUT_MODE.MK;
	};

	reloadGrid = () => {
		const {current} = gridRef;

		if (current) {
			const width: number = current.clientWidth;
			this.setState({width});
		}
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

	renderGrid = () => {
		const {layoutMode, selectedWidget} = this.props;
		const {width} = this.state;
		const isEditable = !!selectedWidget;
		const containerPadding = this.isDesktopMK() ? [16, 20] : [10, 10];
		const containerWidth = this.isDesktopMK() ? 320 : width;
		const widgets = getLayoutWidgets(this.getWidgets(), layoutMode);

		if (width) {
			return (
				<Grid
					breakpoints={BREAKPOINTS}
					cols={COLS}
					compactType={null}
					containerPadding={containerPadding}
					isDraggable={isEditable}
					isResizable={isEditable}
					key={layoutMode}
					onDragStart={this.handleShowGrid(true)}
					onDragStop={this.handleShowGrid(false)}
					onLayoutChange={this.handleLayoutChange}
					rowHeight={ROW_HEIGHT}
					width={containerWidth}
				>
					{widgets.map(this.renderWidget)}
				</Grid>
			);
		}
	};

	renderGridWithContainer = () => {
		return (
			<div className={this.getContainerClassName()} ref={this.gridContainerRef}>
				<div className={styles.grid} ref={gridRef}>
					{this.renderGrid()}
				</div>
			</div>
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
		const {displayMode, id, layout, mkLayout} = widget;
		const isNew = id === NewWidget.id;
		const ref = isNew ? this.newWidgetRef : null;
		const sortedLayout = layoutMode === LAYOUT_MODE.MK ? mkLayout : layout;
		/*
			Раньше использовалось свойство static, для включения\отключения drag`n`drop, но у него наблюдаются проблемы с
			динамическим изменением значения. Поэтому теперь используются 2 свойства - isResizable и isDraggable. Свойство static
			необходимо удалять, т.к оно перебивает значения isResizable и isDraggable.
		 */
		delete layout.static;

		return (
			<Widget
				buildData={buildData[id]}
				data={widget}
				data-grid={sortedLayout}
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
