// @flow
import type {AnyWidget, Widget as WidgetType} from 'store/widgets/data/types';
import cn from 'classnames';
import ContextMenu from 'components/molecules/ContextMenu';
import DashboardPanel from 'components/organisms/DashboardPanel';
import {debounce} from 'helpers';
import type {DivRef} from 'components/types';
import {generateWebSMLayout, isEqualsLayouts} from './helpers';
import {getLayoutWidgets} from 'store/widgets/helpers';
import {GRID_PROPS, gridRef} from './constants';
import isMobile from 'ismobilejs';
import {Item as MenuItem} from 'rc-menu';
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
		contextMenu: null,
		lastWebLGLayouts: null,
		selectedWidget: '',
		swipedPanel: false,
		width: null
	};

	addDiagramWidget = () => {
		const {createNewWidget, layoutMode} = this.props;

		createNewWidget(layoutMode);
		this.setState({contextMenu: null});
	};

	addTextWidget = () => {
		const {createNewTextWidget, layoutMode} = this.props;

		createNewTextWidget(layoutMode);
		this.setState({contextMenu: null});
	};

	componentDidMount () {
		const {editableDashboard, layoutMode, layouts, user} = this.props;

		if (editableDashboard && user.role === USER_ROLES.REGULAR) {
			window.addEventListener('beforeunload', (event) => {
				event.preventDefault();
				event.returnValue = '';
			});
		}

		if (layoutMode === LAYOUT_MODE.WEB) {
			const {lg} = layouts;

			this.setState({lastWebLGLayouts: lg});
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
		const {lastWebLGLayouts} = this.state;
		const {lg, sm} = layouts;

		if (layout === lg && layoutMode === LAYOUT_MODE.WEB && !isEqualsLayouts(lg, lastWebLGLayouts)) {
			layouts.sm = generateWebSMLayout(lg, sm);
			this.setState({lastWebLGLayouts: lg});
		}

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

	hideContextMenu = () => this.setState({contextMenu: null});

	isDesktopMK = () => {
		const {layoutMode} = this.props;

		return !isMobile().any && layoutMode === LAYOUT_MODE.MOBILE;
	};

	onContextMenu = (e: MouseEvent) => {
		let {clientX, clientY, target} = e;

		const {current: container} = this.gridContainerRef;
		const isNeedContainer = target === container || (target instanceof Node && target.parentElement === container);

		if (isNeedContainer) {
			if (container) {
				const {top} = container.getBoundingClientRect();

				this.setState({ contextMenu: { x: clientX, y: clientY - top } });
			}

			e.preventDefault();
		}
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

	renderContextMenu = () => {
		const {contextMenu} = this.state;

		if (contextMenu) {
			return (
				<ContextMenu
					{...contextMenu}
					hideContextMenu={this.hideContextMenu}
				>
					<MenuItem key='widget' onClick={this.addDiagramWidget}>Добавить виджет</MenuItem>
					<MenuItem key='text' onClick={this.addTextWidget}>Добавить текст</MenuItem>
				</ContextMenu>
			);
		}

		return null;
	};

	renderCreateButton = () => {
		const {showCreationInfo} = this.props;

		if (showCreationInfo) {
			return (
				<div className={styles.createButtonPlace}>
					<div>
						Отсутствуют данные для отображения. Чтобы создать виджет, нажмите
						<a aria-pressed="false" onClick={this.addDiagramWidget} role="button">здесь</a>
						или кликнете правой кнопкой мыши на свободное пространство
					</div>
				</div>
			);
		}

		return null;
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
				<div className={containerCN} onClick={this.handleClick} onContextMenu={this.onContextMenu} ref={this.gridContainerRef}>
					{this.renderContextMenu()}
					{this.renderGrid()}
					{this.renderCreateButton()}
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
			callWidgetFilters,
			clearWarningMessage,
			clearWidgetFilters,
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
				callWidgetFilters={callWidgetFilters}
				clearWarningMessage={clearWarningMessage}
				clearWidgetFilters={clearWidgetFilters}
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
