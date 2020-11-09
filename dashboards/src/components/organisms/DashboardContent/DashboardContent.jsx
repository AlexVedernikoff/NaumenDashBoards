// @flow
import cn from 'classnames';
import {DashboardPanel} from 'components/organisms';
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
import {resizer} from 'index';
import {Responsive as Grid} from 'react-grid-layout';
import type {State, WidgetRef} from './types';
import styles from './styles.less';
import type {Widget as WidgetType} from 'store/widgets/data/types';

export const gridRef: DivRef = createRef();

export class DashboardContent extends Component<Props, State> {
	gridContainerRef: DivRef = createRef();
	newWidgetRef: WidgetRef = createRef();
	state = {
		focusedWidget: '',
		newWidgetFocused: false,
		swipedPanel: false,
		width: null
	};

	componentDidMount () {
		window.addEventListener('blur', this.resetFocus);
	}

	componentDidUpdate () {
		this.setFocusOnNewWidget();
	}

	componentWillUnmount () {
		window.removeEventListener('blur', this.resetFocus);
	}

	focusOnSelectWidget = (widgetRef: DivRef) => () => {
		const {current: widget} = widgetRef;
		const {current: container} = this.gridContainerRef;

		if (!resizer.isFullSize() && container && widget) {
			const top = widget.getBoundingClientRect().top - container.getBoundingClientRect().top;
			container.scrollTo({behavior: 'smooth', top: Math.max(top, 0)});
		}
	};

	handleClick = (focusedWidget: string) => {
		const {focusedWidget: currentFocusedWidget} = this.state;

		if (currentFocusedWidget !== focusedWidget) {
			this.setState({focusedWidget});
		}
	};

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

	handleWidgetSelect = (id: string, ref: DivRef) => {
		const {editMode, selectWidget, selectedWidget} = this.props;

		if (id !== selectedWidget) 	{
			const callback = editMode ? null : this.focusOnSelectWidget(ref);
			selectWidget(id, callback);
		}

		this.setState({swipedPanel: false});
	};

	isDesktopMK = () => {
		const {layoutMode} = this.props;
		return !isMobile().any && layoutMode === LAYOUT_MODE.MOBILE;
	};

	resetFocus = () => this.state.focusedWidget && this.setState({focusedWidget: ''});

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
			const width: number = Math.round(current.offsetWidth - parseFloat(paddingLeft) - parseFloat(paddingRight));

			this.setState({width});
			resizer.resize();
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

		return null;
	};

	renderGridWithContainer = () => {
		const containerCN = cn({
			[styles.gridContainer]: true,
			[styles.MKGridContainer]: this.isDesktopMK()
		});

		return (
			<ResizeDetector className={containerCN} forwardedRef={this.gridContainerRef} onClick={this.resetFocus} onResize={this.setGridWidth}>
				{this.renderGrid()}
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
			layoutMode,
			openCardObject,
			personalDashboard,
			removeWidget,
			selectedWidget,
			updateWidget,
			user
		} = this.props;
		const {focusedWidget} = this.state;
		const {id} = widget;
		const isNew = id === NewWidget.id;
		const focused = focusedWidget === widget.id;
		const ref = isNew ? this.newWidgetRef : null;

		return (
			<Widget
				buildData={buildData[id]}
				data={widget}
				editWidgetChunkData={editWidgetChunkData}
				fetchBuildData={fetchBuildData}
				focused={focused}
				isEditable={editable}
				isNew={isNew}
				isSelected={selectedWidget === widget.id}
				key={id}
				layoutMode={layoutMode}
				onClick={this.handleClick}
				onDrillDown={drillDown}
				onEdit={this.handleWidgetSelect}
				onOpenCardObject={openCardObject}
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
				{this.renderPanel()}
			</div>
		);
	}
}

export default DashboardContent;
