// @flow
import './styles.less';
import {editContentRef} from 'components/pages/DashboardEditContent';
import type {Element} from 'react';
import {GRID_PARAMS} from 'utils/layout';
import {NewWidget} from 'utils/widget';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import {Responsive as Grid} from 'react-grid-layout';
import {Widget, WidgetRemovalModal} from 'components/molecules';
import type {Widget as WidgetType} from 'store/widgets/data/types';

const props = {
	autoSize: undefined,
	breakpoint: undefined,
	className: undefined,
	draggableCancel: undefined,
	draggableHandle: undefined,
	isDraggable: undefined,
	isResizable: undefined,
	layout: undefined,
	margin: undefined,
	maxRows: undefined,
	onDrag: undefined,
	onDragStart: undefined,
	onDragStop: undefined,
	onResize: undefined,
	onResizeStart: undefined,
	onResizeStop: undefined,
	preventCollision: undefined,
	style: undefined,
	useCSSTransforms: undefined,
	verticalCompact: undefined
};

export const gridRef = createRef();
const newWidgetRef = createRef();

export class LayoutGrid extends Component<Props, State> {
	static defaultProps = {
		editable: false,
		role: null,
		selectedWidget: ''
	};

	state = {
		newWidgetExists: false,
		showModal: false,
		widgetIdToRemove: '',
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
		const {editable} = this.props;

		if (editable) {
			const {current: newWidget} = newWidgetRef;
			const {current: grid} = gridRef;
			const {current: content} = editContentRef;
			const {newWidgetExists} = this.state;

			if (newWidget && grid && !newWidgetExists) {
				this.setState(() => ({newWidgetExists: true}));
				content && content.scrollTo(0, grid.clientHeight);
			} else if (!newWidget && newWidgetExists) {
				this.setState(() => ({newWidgetExists: false}));
			}
		}
	}

	componentWillUnmount () {
		window.removeEventListener('resize', this.reloadGrid);
	}

	hideModal = () => this.setState({showModal: false, widgetIdToRemove: ''});

	reloadGrid = () => {
		const {current} = gridRef;

		if (current) {
			const width: number = current.clientWidth;
			this.setState({width});
		}
	};

	handleDrillDownWidget = (widget: WidgetType, orderNum?: number) => {
		const {comboDrillDown, drillDown} = this.props;
		orderNum ? comboDrillDown(widget, orderNum) : drillDown(widget);
	};

	handleEditWidget = (id: string) => {
		const {onSelectWidget} = this.props;
		onSelectWidget(id);
	};

	removeWidget = (onlyPersonal: boolean) => {
		const {onRemoveWidget} = this.props;
		const {widgetIdToRemove} = this.state;

		this.hideModal();
		onRemoveWidget(widgetIdToRemove, onlyPersonal);
	};

	showRemovalModal = (widgetIdToRemove: string) => this.setState({showModal: true, widgetIdToRemove});

	renderGrid = () => {
		const {onLayoutChange} = this.props;
		const {width} = this.state;

		if (width) {
			return (
				<Grid
					breakpoints={GRID_PARAMS.BREAK_POINTS}
					cols={GRID_PARAMS.COLS}
					compactType={null}
					containerPadding={GRID_PARAMS.CONTAINER_PADDING}
					onLayoutChange={onLayoutChange}
					rowHeight={GRID_PARAMS.ROW_HEIGHT}
					width={width}
					{...props}
				>
					{this.renderWidgets()}
				</Grid>
			);
		}
	};

	renderRemovalModal = () => {
		const {role} = this.props;
		const {showModal} = this.state;

		if (showModal) {
			return (
				<WidgetRemovalModal
					onClose={this.hideModal}
					onSubmit={this.removeWidget}
					role={role}
				/>
			);
		}
	};

	renderWidget = (widget: WidgetType) => {
		const {diagrams, editable, selectedWidget} = this.props;
		const {id, layout} = widget;
		const isNew = id === NewWidget.id;
		const ref = isNew ? newWidgetRef : null;

		return (
			<div data-grid={layout} key={id} ref={ref}>
				<Widget
					data={widget}
					diagram={diagrams[id]}
					isEditable={editable}
					isNew={isNew}
					isSelected={selectedWidget === widget.id}
					key={id}
					onDrillDown={this.handleDrillDownWidget}
					onEdit={this.handleEditWidget}
					onRemove={this.showRemovalModal}
				/>
			</div>
		);
	};

	renderWidgets = (): Array<Element<'div'>> => {
		const {widgets} = this.props;
		// $FlowFixMe
		return Object.values(widgets).map(this.renderWidget);
	};

	render () {
		return (
			<div ref={gridRef}>
				{this.renderGrid()}
				{this.renderRemovalModal()}
			</div>
		);
	}
}

export default LayoutGrid;
