// @flow
import type {AnyWidget, WidgetType} from 'store/widgets/data/types';
import {calculatePosition, generateWebSMLayout, getSortedWidgetsByLayout, isEqualsLayouts} from './helpers';
import ChartWidget from 'containers/ChartWidget';
import cn from 'classnames';
import ContextMenu from 'components/molecules/ContextMenu';
import {debounce} from 'helpers';
import {DESKTOP_MK_WIDTH, GRID_PROPS, gridRef} from './constants';
import type {DivRef, Ref} from 'components/types';
import {getLayoutWidgets} from 'store/widgets/helpers';
import GridItem from './components/Item';
import {Item as MenuItem} from 'rc-menu';
import type {Layout, Layouts} from 'store/dashboard/layouts/types';
import {LAYOUT_BREAKPOINTS, LAYOUT_MODE} from 'store/dashboard/settings/constants';
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
		gridMounted: false,
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
		const {editableDashboard, isUserMode, layoutMode, layouts, user} = this.props;

		if (editableDashboard && !isUserMode && user.role === USER_ROLES.REGULAR) {
			window.addEventListener('beforeunload', (event) => {
				event.preventDefault();
				event.returnValue = '';
			});
		}

		if (layoutMode === LAYOUT_MODE.WEB) {
			const {lg} = layouts;

			this.setState({lastWebLGLayouts: lg});
		}

		this.setWidthByContainer();
	}

	componentDidUpdate (prevProps: Props) {
		const {focusWidget, selectedWidget} = this.props;

		if (!dashboardResizer.isFullSize() && !prevProps.selectedWidget && selectedWidget) {
			focusWidget(selectedWidget);
		}
	}

	handleClick = () => {
		const {editMode, resetWidget, selectedWidget} = this.props;

		if (!editMode && selectedWidget) {
			resetWidget();
		}
	};

	handleDrag = () => this.toggleGrid(true);

	handleDragStop = () => this.toggleGrid(false);

	handleFocus = (element: HTMLDivElement) => {
		const {resetFocusedWidget} = this.props;

		element.scrollIntoView();
		resetFocusedWidget();
	};

	handleItemClick = (e) => e.stopPropagation();

	handleLayoutChange = debounce((layout: Layout, layouts: Layouts) => {
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
	}, 1000);

	handleResize = () => {
		dashboardResizer.resize(() => this.setState(() => ({gridMounted: true})));
		this.setWidthByContainer();
	};

	hideContextMenu = () => this.setState({contextMenu: null});

	isDesktopMK = () => {
		const {isMobileDevice, layoutMode} = this.props;

		return !isMobileDevice && layoutMode === LAYOUT_MODE.MOBILE;
	};

	onContextMenu = (e: MouseEvent) => {
		const {hasCreateNewWidget} = this.props;
		const {clientX, clientY, target} = e;

		if (hasCreateNewWidget && this.gridContainerRef?.current) {
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

	setWidthByContainer = () => {
		const {current} = this.gridContainerRef;

		if (current) {
			const {paddingLeft, paddingRight} = getComputedStyle(current);
			const width: number = Math.round(current.offsetWidth - parseFloat(paddingLeft) - parseFloat(paddingRight));

			this.setState(() => ({width}));
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

	renderCreateInfo = () => {
		const {isMobileDevice, showCreationInfo} = this.props;

		if (showCreationInfo) {
			if (isMobileDevice) {
				return this.renderMobileInfo();
			} else {
				return this.renderDesktopCreateInfo();
			}
		}

		return null;
	};

	renderDesktopCreateInfo = () => (
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

	renderGrid = () => {
		const {layoutMode, layouts, selectedWidget, widgets} = this.props;
		const {width} = this.state;

		if (width) {
			const isEditable = Boolean(selectedWidget);
			const containerWidth = this.isDesktopMK() ? DESKTOP_MK_WIDTH : width;
			const layoutWidgets = getLayoutWidgets(widgets, layoutMode);
			const sortedLayoutWidgets = getSortedWidgetsByLayout(layoutWidgets, layouts[LAYOUT_BREAKPOINTS.LG]);

			return (
				<ResizeDetector forwardedRefKey="innerRef" onResize={this.handleResize}>
					<Grid
						innerRef={gridRef}
						isDraggable={isEditable}
						isResizable={isEditable}
						layouts={layouts}
						onDrag={this.handleDrag}
						onDragStop={this.handleDragStop}
						onLayoutChange={this.handleLayoutChange}
						ref={this.dashGrid}
						resizeHandles={GRID_PROPS.resizeHandles}
						width={containerWidth}
						{...GRID_PROPS[layoutMode]}
					>
						{sortedLayoutWidgets.map(this.renderGridItem)}
					</Grid>
				</ResizeDetector>
			);
		}

		return null;
	};

	renderGridItem = (widget: AnyWidget | NewWidget) => {
		const {focusedWidget, selectedWidget} = this.props;
		const {gridMounted} = this.state;
		const focused = gridMounted && widget.id === focusedWidget;
		const selected = widget.id === selectedWidget;

		return (
			<GridItem focused={focused} key={widget.id} onClick={this.handleItemClick} onFocus={this.handleFocus} selected={selected}>
				{widget instanceof NewWidget ? null : this.renderWidget(widget)}
			</GridItem>
		);
	};

	renderMobileInfo = () => (
		<div className={styles.createButtonPlace}>
			<div className={styles.creationButtonInfo}>
				Отсутствуют данные для отображения. Для редактирования дашборда необходимо открыть полную версию приложения на компьютере
			</div>
		</div>
	);

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
		const {isMobileDevice} = this.props;
		const containerCN = cn({
			[styles.gridContainer]: true,
			[styles.MKGridContainer]: this.isDesktopMK()
		});
		const onContextMenu = !isMobileDevice ? this.onContextMenu : null;

		return (
			<div className={containerCN} onClick={this.handleClick} onContextMenu={onContextMenu} ref={this.gridContainerRef}>
				{this.renderContextMenu()}
				{this.renderGrid()}
				{this.renderCreateInfo()}
			</div>
		);
	}
}

export default WidgetsGrid;
