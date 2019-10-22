// @flow
import {Chart, Summary, Table} from 'components/molecules';
import {CHART_VARIANTS} from 'utils/chart';
import {createOrderName, NewWidget, WIDGET_VARIANTS} from 'utils/widget';
import type {DiagramData} from 'store/widgets/diagrams/types';
import {EditIcon, UnionIcon} from 'icons/form';
import type {Element} from 'react';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {GRID_PARAMS} from 'utils/layout';
import type {Props, State} from './types';
import React, {Component, createRef, Fragment} from 'react';
import ReactTooltip from 'react-tooltip';
import {Responsive as Grid} from 'react-grid-layout';
import styles from './styles.less';
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

export class LayoutGrid extends Component<Props, State> {
	static defaultProps = {
		editable: false
	};

	state = {
		width: null
	};

	/**
	 * Для использования адаптивности библиотеки "react-grid-layout",
	 * необходимо указать точную ширину рабочей области. Обернув компонент Layout
	 * в обычный div, у нас появляется возможность, после первичного рендера, взять его ширину
	 * и пробросить ее в дочерний компонент, тем самым задав сетке виджетов оптимальную ширину.
	 */
	componentDidMount () {
		const {current} = gridRef;

		if (current) {
			const width: number = current.clientWidth;

			this.setState({width});
			window.addEventListener('resize', this.reloadGrid);
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

	renderLoading = () => <p>Загрузка...</p>;

	renderError = () => <p>Ошибка загрузки данных.</p>;

	resolveDiagram = (widget: Widget, diagram: DiagramData) => {
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		const renders = {
			[SUMMARY]: Summary,
			[TABLE]: Table
		};

		const Diagram = renders[widget.type.value] || Chart;

		return <Diagram data={diagram} widget={widget} />;
	};

	renderDiagram = (widget: Widget) => {
		const {diagrams} = this.props;
		const {data, loading} = diagrams[widget.id];

		if (loading) {
			return this.renderLoading();
		}

		if (data) {
			return this.resolveDiagram(widget, data);
		}

		return this.renderError();
	};

	renderEditButton = (id: string) => {
		const {editable} = this.props;

		if (editable) {
			return (
				<button
					className={styles.buttonAction}
					data-tip="Редактировать"
					onClick={this.handleClickEdit(id)}
					type="button"
				>
					<EditIcon />
				</button>
			);
		}
	};

	renderDrillDownButton = (id: string) => (
		<button
			className={styles.buttonAction}
			data-tip="Перейти"
			data-id={id}
			onClick={this.handleClickDrillDown(id)}
			type="button"
		>
			<UnionIcon />
		</button>
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
					<button
						className={styles.buttonAction}
						data-tip={tipText} type="button"
						data-id={id}
						data-order={num}
						key={dataKey}
						onClick={this.handleClickComboDrillDown(id, num)}
					>
						<UnionIcon/>
					</button>
				);
			});
		}
	};

	renderDrillDownButtonByType = (widget: Widget) => {
		if (widget.type.value === CHART_VARIANTS.COMBO) {
			return this.renderDrillDownButtons(widget);
		}

		return this.renderDrillDownButton(widget.id);
	};

	renderButtons = (widget: Widget): Element<'div'> => (
		<div className={styles.widgetActions}>
			{this.renderEditButton(widget.id)}
			{this.renderDrillDownButtonByType(widget)}
			<ReactTooltip effect="solid" place="bottom" type="info" />
		</div>
	);

	renderWidgetByType = (widget: Widget) => {
		if (!(widget instanceof NewWidget)) {
			return (
				<Fragment>
					{this.renderDiagram(widget)}
					{this.renderButtons(widget)}
				</Fragment>
			);
		}
	};

	renderWidget = (widget: Widget): Element<'div'> => {
		const {id, layout} = widget;

		return (
			<div key={id} data-grid={layout} className={styles.widget}>
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
