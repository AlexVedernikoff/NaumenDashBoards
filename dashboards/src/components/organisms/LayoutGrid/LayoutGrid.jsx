// @flow
import {Chart, Summary, Table} from 'components/molecules';
import type {DiagramData} from 'store/widgets/diagrams/types';
import EditIcon from 'icons/header/edit.svg';
import type {Element} from 'react';
import {GRID_PARAMS} from 'utils/layout';
import {NewWidget, WIDGET_VARIANTS} from 'utils/widget';
import type {Props, State} from './types';
import React, {Component, createRef, Fragment} from 'react';
import {Responsive as Grid} from 'react-grid-layout';
import styles from './styles.less';
import UnionIcon from 'icons/header/union.svg';
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

	handleClickEdit = (event: SyntheticMouseEvent<HTMLButtonElement>): void => {
		const {editDashboard, onWidgetSelect} = this.props;
		editDashboard();
		onWidgetSelect(event);
	};

	handleClick = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
		const {goOver} = this.props;
		const id = e.currentTarget.dataset.id;

		goOver(id);
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

	renderButtons = (widget: Widget): Element<'div'> => {
		const {id} = widget;

		return (
			<div className={styles.widgetActions}>
				<button className={styles.buttonAction} type="button" data-id={id} onClick={this.handleClickEdit}>
					<EditIcon />
				</button>
				<button className={styles.buttonAction} type="button" data-id={id} onClick={this.handleClick}>
					<UnionIcon />
				</button>
			</div>
		);
	};

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
