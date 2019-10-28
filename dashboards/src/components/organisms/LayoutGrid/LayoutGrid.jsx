// @flow
import {CHART_VARIANTS} from 'utils/chart';
import {createOrderName, NewWidget} from 'utils/widget';
import {Diagram} from 'components/molecules';
import {editContentRef} from 'components/pages/DashboardEditContent';
import {EditIcon, UnionIcon} from 'icons/form';
import type {Element} from 'react';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {GRID_PARAMS} from 'utils/layout';
import {IconButton} from 'components/atoms';
import type {Props, State} from './types';
import React, {Component, createRef, Fragment} from 'react';
import {Responsive as Grid} from 'react-grid-layout';
import styles from './styles.less';
import {viewContentRef} from 'components/pages/DashboardViewContent';
import type {Widget} from 'store/widgets/data/types';

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
		editable: false
	};

	state = {
		newWidgetExists: false,
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
		const {current} = newWidgetRef;
		const {newWidgetExists} = this.state;

		if (current && !newWidgetExists) {
			this.setState(() => ({newWidgetExists: true}));
			const content = editContentRef.current ? editContentRef.current : viewContentRef.current;
			content && content.scrollTo(0, content.clientHeight);
		} else if (!current && newWidgetExists) {
			this.setState(() => ({newWidgetExists: false}));
		}
	}

	componentWillUnmount () {
		window.removeEventListener('resize', this.reloadGrid);
	}

	reloadGrid = () => {
		const {current} = gridRef;

		if (current) {
			const width: number = current.clientWidth;
			this.setState({width});
		}
	};

	handleClickEdit = (id: string) => (): void => {
		const {onSelectWidget} = this.props;
		onSelectWidget(id);
	};

	handleClickDrillDown = (id: string) => () => {
		const {drillDown, widgets} = this.props;
		drillDown(widgets[id]);
	};

	handleClickComboDrillDown = (id: string, orderNum: number) => () => {
		const {comboDrillDown, widgets} = this.props;
		comboDrillDown(widgets[id], orderNum);
	};

	renderEditButton = (id: string) => {
		const {editable} = this.props;

		if (editable) {
			return (
				<IconButton tip="Редактировать" onClick={this.handleClickEdit(id)}>
					<EditIcon />
				</IconButton>
			);
		}
	};

	renderDrillDownButton = (id: string) => (
		<IconButton tip="Перейти" onClick={this.handleClickDrillDown(id)}>
			<UnionIcon />
		</IconButton>
	);

	renderDrillDownButtons = (widget: Widget) => {
		const {id, order} = widget;

		if (Array.isArray(order)) {
			return order.map(num => {
				const dataKey = widget[createOrderName(num)(FIELDS.dataKey)];
				const source = widget[createOrderName(num)(FIELDS.source)];
				let tipText = 'Перейти';

				if (source) {
					tipText = `${tipText} (${source.label})`;
				}

				return (
					<IconButton key={dataKey} tip={tipText} onClick={this.handleClickComboDrillDown(id, num)}>
						<UnionIcon />
					</IconButton>
				);
			});
		}
	};

	renderDrillDownButtonByType = (widget: Widget) => {
		if (widget.type && widget.type.value === CHART_VARIANTS.COMBO) {
			return this.renderDrillDownButtons(widget);
		}

		return this.renderDrillDownButton(widget.id);
	};

	renderButtons = (widget: Widget): Element<'div'> => (
		<div className={styles.widgetActions}>
			{this.renderEditButton(widget.id)}
			{this.renderDrillDownButtonByType(widget)}
		</div>
	);

	renderWidgetByType = (widget: Widget) => {
		const {diagrams} = this.props;

		if (!(widget instanceof NewWidget)) {
			return (
				<Fragment>
					<Diagram widget={widget} diagram={diagrams[widget.id]} />
					{this.renderButtons(widget)}
				</Fragment>
			);
		}
	};

	renderWidget = (widget: Widget): Element<'div'> => {
		const {id, layout} = widget;
		const ref = id === NewWidget.id ? newWidgetRef : null;

		return (
			<div key={id} data-grid={layout} className={styles.widget} ref={ref}>
				{this.renderWidgetByType(widget)}
			</div>
		);
	};

	renderWidgets = (): Array<Element<'div'>> => {
		const {widgets} = this.props;
		return Object.keys(widgets).map(key => this.renderWidget(widgets[key]));
	};

	renderGrid = () => {
		const {width} = this.state;
		const {onLayoutChange} = this.props;

		if (width) {
			return (
				<Grid
					breakpoints={GRID_PARAMS.BREAK_POINTS}
					className={styles.grid}
					cols={GRID_PARAMS.COLS}
					containerPadding={GRID_PARAMS.CONTAINER_PADDING}
					compactType={null}
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

	render () {
		return (
			<div ref={gridRef}>
				{this.renderGrid()}
			</div>
		);
	}
}

export default LayoutGrid;
