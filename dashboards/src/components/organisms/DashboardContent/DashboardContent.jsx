// @flow
import type {AnyWidget, Widget as WidgetType} from 'store/widgets/data/types';
import cn from 'classnames';
import DashboardPanel from 'components/organisms/DashboardPanel';
import {debounce} from 'helpers';
import type {DivRef} from 'components/types';
import {getLayoutWidgets} from 'store/widgets/helpers';
import {GRID_PROPS, gridRef} from './constants';
import isMobile from 'ismobilejs';
import type {Layout, Layouts} from 'store/dashboard/layouts/types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props} from 'containers/DashboardContent/types';
import React, {Component, createRef} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import {resizer as dashboardResizer} from 'app.constants';
import {Responsive as Grid} from 'react-grid-layout';
import type {State} from './types';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import Widget from 'components/molecules/Widget';

export class DashboardContent extends Component<Props, State> {
	gridContainerRef: DivRef = createRef();
	state = {
		selectedWidget: '',
		swipedPanel: false,
		width: null
	};

	componentDidMount () {
		const {editableDashboard, user} = this.props;

		if (editableDashboard && user.role === USER_ROLES.REGULAR) {
			window.addEventListener('beforeunload', (event) => {
				event.preventDefault();
				event.returnValue = '';
			});
		}
	}

	handleClick = () => this.setState({selectedWidget: ''});

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

	handleToggleSwipePanel = () => this.setState({swipedPanel: !this.state.swipedPanel});

	handleWidgetClick = (e: SyntheticMouseEvent<HTMLDivElement>, widget: AnyWidget) => {
		e.stopPropagation();
		this.setState({selectedWidget: widget.id});
	};

	handleWidgetFocus = (element: HTMLDivElement) => {
		const {editMode: editableDashboard, resetFocusedWidget} = this.props;
		const {current: container} = this.gridContainerRef;
		const {top} = element.getBoundingClientRect();
		let y = 0;

		if (dashboardResizer.isFullSize() || editableDashboard) {
			container && container.scrollTo({
				behavior: 'smooth',
				top: Math.max(top - container.getBoundingClientRect().top + container.scrollTop, 0)
			});
		} else {
			y = top;
		}

		dashboardResizer.scrollTo(0, y);
		resetFocusedWidget();
	};

	handleWidgetSelect = (id: string) => {
		const {focusWidget, selectWidget, selectedWidget} = this.props;

		if (!dashboardResizer.isFullSize() && !selectedWidget) {
			focusWidget(id);
		}

		this.setState({swipedPanel: false});
		selectWidget(id);
	};

	isDesktopMK = () => {
		const {layoutMode} = this.props;
		return !isMobile().any && layoutMode === LAYOUT_MODE.MOBILE;
	};

	setGridWidth = () => {
		const {current} = this.gridContainerRef;

		if (current) {
			const {paddingLeft, paddingRight} = getComputedStyle(current);
			const width: number = Math.round(current.offsetWidth - parseFloat(paddingLeft) - parseFloat(paddingRight));

			this.setState({width});
			dashboardResizer.resize();
		}
	};

	renderGrid = () => {
		const {layoutMode, layouts, selectedWidget, widgets} = this.props;
		const {selectedWidget: localSelectedWidget, width} = this.state;

		if (width) {
			const isEditable = Boolean(selectedWidget || localSelectedWidget);
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
					resizeHandles={GRID_PROPS.resizeHandles}
					width={containerWidth}
					{...GRID_PROPS[layoutMode]}
				>
					{layoutWidgets.map(this.renderWidget)}
				</Grid>
			);
		}

		return null;
	};

	renderGridWithContainer = () => {
		const containerCN = cn({
			[styles.gridContainer]: true,
			[styles.MKGridContainer]: this.isDesktopMK()
		});

		return (
			<ResizeDetector onResize={this.setGridWidth}>
				<div className={containerCN} onClick={this.handleClick} ref={this.gridContainerRef}>
					{this.renderGrid()}
				</div>
			</ResizeDetector>
		);
	};

	renderPanel = () => {
		const {editMode, selectedWidget} = this.props;
		const {swipedPanel} = this.state;

		if (editMode) {
			return (
				<DashboardPanel
					onToggleSwipe={this.handleToggleSwipePanel}
					selectedWidget={selectedWidget}
					swiped={swipedPanel}
				/>
			);
		}

		return null;
	};

	renderWidget = (widget: WidgetType) => {
		const {
			buildData,
			drillDown,
			editWidgetChunkData,
			editable,
			fetchBuildData,
			focusedWidget,
			layoutMode,
			openCardObject,
			openNavigationLink,
			removeWidget,
			selectedWidget,
			updateWidget
		} = this.props;
		const {id} = widget;
		const isNew = id === NewWidget.id;
		const isSelected = id === selectedWidget;
		const isFocused = id === focusedWidget;

		return (
			<Widget
				buildData={buildData[id]}
				data={widget}
				editWidgetChunkData={editWidgetChunkData}
				fetchBuildData={fetchBuildData}
				focused={isFocused}
				isEditable={editable}
				isNew={isNew}
				isSelected={isSelected}
				key={id}
				layoutMode={layoutMode}
				onClick={this.handleWidgetClick}
				onDrillDown={drillDown}
				onEdit={this.handleWidgetSelect}
				onFocus={this.handleWidgetFocus}
				onOpenCardObject={openCardObject}
				onOpenNavigationLink={openNavigationLink}
				onRemove={removeWidget}
				onUpdate={updateWidget}
			/>
		);
	};

	render () {
		return (
			<div className={styles.content}>
				{this.renderGridWithContainer()}
				{this.renderPanel()}
			</div>
		);
	}
}

export default DashboardContent;
