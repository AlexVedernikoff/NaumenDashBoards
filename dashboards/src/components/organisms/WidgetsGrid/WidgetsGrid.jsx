// @flow
import type {AnyWidget, WidgetType} from 'store/widgets/data/types';
import {calculatePosition, generateWebSMLayout, isEqualsLayouts} from './helpers';
import ChartWidget from 'containers/ChartWidget';
import cn from 'classnames';
import ContextMenu from 'components/molecules/ContextMenu';
import {debounce} from 'helpers';
import {DESKTOP_MK_WIDTH, GRID_PROPS, gridRef} from './constants';
import type {DivRef, Ref} from 'components/types';
import {getLayoutWidgets} from 'store/widgets/helpers';
import GridItem from './components/Item';
import isMobile from 'ismobilejs';
import {Item as MenuItem} from 'rc-menu';
import type {Layout, Layouts} from 'store/dashboard/layouts/types';
import {LAYOUT_MODE} from 'store/dashboard/settings/constants';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import {resizer as dashboardResizer} from 'app.constants';
import {Responsive as Grid} from 'react-grid-layout';
import SpeedometerWidget from 'components/organisms/SpeedometerWidget';
import styles from './styles.less';
import SummaryWidget from 'containers/SummaryWidget/SummaryWidget';
import TableWidget from 'containers/TableWidget';
import TextWidget from 'components/organisms/TextWidget';
import {USER_ROLES} from 'store/context/constants';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class WidgetsGrid extends Component<Props, State> {
	state = {
		contextMenu: null,
		lastWebLGLayouts: null,
		width: null
	};
	gridContainerRef: DivRef = createRef();
	dashGrid: Ref<typeof Grid> = createRef();

	addNewDiagram = () => this.addNewWidget(WIDGET_TYPES.COLUMN);

	addNewText = () => this.addNewWidget(WIDGET_TYPES.TEXT);

	addNewWidget = (type: WidgetType) => {
		const {addNewWidget, layoutMode} = this.props;
		const {contextMenu} = this.state;

		if (this.dashGrid.current) {
			const {breakpoints, cols, rowHeight, width} = this.dashGrid.current.props;
			const recommendedPosition = contextMenu
				? calculatePosition(layoutMode, breakpoints, cols, rowHeight, width, contextMenu.x, contextMenu.y)
				: null;

			addNewWidget(new NewWidget(layoutMode, type, recommendedPosition));
			this.setState({contextMenu: null});
		}
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

	componentDidUpdate (prevProps: Props) {
		const {focusWidget, selectedWidget} = this.props;

		if (!dashboardResizer.isFullSize() && !prevProps.selectedWidget && selectedWidget) {
			focusWidget(selectedWidget);
		}
	}

	handleDrag = () => this.toggleGrid(true);

	handleDragStop = () => this.toggleGrid(false);

	handleFocus = (element: HTMLDivElement) => {
		const {editMode: editableDashboard, resetFocusedWidget} = this.props;
		const {current: container} = this.gridContainerRef;
		const {top} = element.getBoundingClientRect();
		let y = top;

		if (dashboardResizer.isFullSize() || editableDashboard) {
			container && container.scrollTo({
				behavior: 'smooth',
				top: Math.max(top - container.getBoundingClientRect().top + container.scrollTop, 0)
			});

			y = 0;
		}

		dashboardResizer.scrollTo(0, y);
		resetFocusedWidget();
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

	handleResize = () => {
		const {current} = this.gridContainerRef;

		if (current) {
			const {paddingLeft, paddingRight} = getComputedStyle(current);
			const width: number = Math.round(current.offsetWidth - parseFloat(paddingLeft) - parseFloat(paddingRight));

			this.setState({width});
			dashboardResizer.resize();
		}
	};

	hideContextMenu = () => this.setState({contextMenu: null});

	isDesktopMK = () => {
		const {layoutMode} = this.props;

		return !isMobile().any && layoutMode === LAYOUT_MODE.MOBILE;
	};

	onContextMenu = (e: MouseEvent) => {
		let {clientX, clientY, target} = e;

		if (this.gridContainerRef?.current) {
			const gridElement = this.gridContainerRef?.current;
			const scrollTop = this.gridContainerRef?.current?.scrollTop ?? 0;
			const style = window.getComputedStyle(gridElement);
			const marginLeft = parseInt(style.marginLeft);
			const {current: container} = this.gridContainerRef;
			const isNeedContainer = target === container || (target instanceof Node && target.parentElement === container);

			if (isNeedContainer) {
				if (container) {
					const {top} = container.getBoundingClientRect();

					this.setState({ contextMenu: { x: clientX - marginLeft, y: clientY - top + scrollTop } });
				}

				e.preventDefault();
			}
		}
	};

	toggleGrid = (show: boolean) => {
		const {current: grid} = gridRef;

		grid && grid.classList.toggle(styles.drawnGrid, show);
	};

	renderContextMenu = () => {
		const {contextMenu} = this.state;

		if (contextMenu) {
			return (
				<ContextMenu {...contextMenu} hideContextMenu={this.hideContextMenu}>
					<MenuItem key='widget' onClick={this.addNewDiagram}>Добавить виджет</MenuItem>
					<MenuItem key='text' onClick={this.addNewText}>Добавить текст</MenuItem>
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
					<div className={styles.creationButtonInfo}>
						Отсутствуют данные для отображения. Чтобы создать виджет, нажмите
						<a aria-pressed="false" className={styles.creationButton} onClick={this.addNewDiagram} role="button">
							здесь
						</a>
						или кликнете правой кнопкой мыши на свободное пространство
					</div>
				</div>
			);
		}

		return null;
	};

	renderGrid = () => {
		const {layoutMode, layouts, selectedWidget, widgets} = this.props;
		const {width} = this.state;

		if (width) {
			const isEditable = Boolean(selectedWidget);
			const containerWidth = this.isDesktopMK() ? DESKTOP_MK_WIDTH : width;
			const layoutWidgets = getLayoutWidgets(widgets, layoutMode);

			return (
				<Grid
					innerRef={gridRef}
					isDraggable={isEditable}
					isResizable={isEditable}
					layouts={layouts}
					onDrag={this.handleDrag}
					onDragStop={this.handleDragStop}
					onLayoutChange={debounce(this.handleLayoutChange, 1000)}
					ref={this.dashGrid}
					resizeHandles={GRID_PROPS.resizeHandles}
					width={containerWidth}
					{...GRID_PROPS[layoutMode]}
				>
					{layoutWidgets.map(this.renderGridItem)}
				</Grid>
			);
		}

		return null;
	};

	renderGridItem = (widget: AnyWidget | NewWidget) => {
		const {focusedWidget, selectedWidget} = this.props;
		const focused = widget.id === focusedWidget;
		const selected = widget.id === selectedWidget;

		return (
			<GridItem focused={focused} key={widget.id} onFocus={this.handleFocus} selected={selected}>
				{widget instanceof NewWidget ? null : this.renderWidget(widget)}
			</GridItem>
		);
	};

	renderWidget = (widget: AnyWidget) => {
		const {
			BAR,
			BAR_STACKED,
			COLUMN,
			COLUMN_STACKED,
			COMBO,
			DONUT,
			LINE,
			PIE,
			SPEEDOMETER,
			SUMMARY,
			TABLE,
			TEXT
		} = WIDGET_TYPES;

		switch (widget.type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case COMBO:
			case DONUT:
			case LINE:
			case PIE:
				return <ChartWidget widget={widget} />;
			case SPEEDOMETER:
				return <SpeedometerWidget widget={widget} />;
			case SUMMARY:
				return <SummaryWidget widget={widget} />;
			case TABLE:
				return <TableWidget widget={widget} />;
			case TEXT:
				return <TextWidget widget={widget} />;
			default:
				return null;
		}
	};

	render () {
		const containerCN = cn({
			[styles.gridContainer]: true,
			[styles.MKGridContainer]: this.isDesktopMK()
		});

		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={containerCN} onContextMenu={this.onContextMenu} ref={this.gridContainerRef}>
					{this.renderContextMenu()}
					{this.renderGrid()}
					{this.renderCreateButton()}
				</div>
			</ResizeDetector>
		);
	}
}

export default WidgetsGrid;
