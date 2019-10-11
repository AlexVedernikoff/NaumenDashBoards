// @flow
import Chart from 'components/molecules/Chart';
import type {ContainerRef, Props, State} from './types';
import type {DiagramData} from 'store/widgets/diagrams/types';
import type {Element} from 'react';
import {GRID_PARAMS} from 'utils/layout';
import {NewWidget, WIDGET_VARIANTS} from 'utils/widget';
import React, {Component} from 'react';
import {RefContainer} from 'utils/refConatiner';
import {Responsive as Grid} from 'react-grid-layout';
import styles from './styles.less';
import Summary from 'components/molecules/Summary';
import Table from 'components/molecules/Table';
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

export class LayoutGrid extends Component<Props, State> {
	static defaultProps = {
		isEditable: false
	};

	state = {
		width: null
	};

	container: ContainerRef = React.createRef();

	/**
	 * Для использования адаптивности библиотеки "react-grid-layout",
	 * необходимо указать точную ширину рабочей области. Обернув компонент Layout
	 * в обычный div, у нас появляется возможность, после первичного рендера, взять его ширину
	 * и пробросить ее в дочерний компонент, тем самым задав сетке виджетов оптимальную ширину.
	 */
	componentDidMount () {
		const {current} = this.container;

		if (current) {
			const width: number = current.clientWidth;

			this.setState({width});

			this.createContainer(current);
			window.addEventListener('resize', this.reloadGrid);
		}
	}

	componentDidUpdate () {
		const {current} = this.container;

		if (current) {
			this.updateContainer(current);
		}
	}

	createContainer = (current: HTMLDivElement) => new RefContainer(current);
	updateContainer = (current: HTMLDivElement) => new RefContainer().updatetRef(current);

	reloadGrid = () => {
		const {current} = this.container;

		if (current) {
			const width: number = current.clientWidth;
			this.setState({width});
		}
	};

	renderButton = (id: string) => {
		const {isEditable, onSelectWidget} = this.props;

		if (isEditable) {
			return (
				<button className={styles.edit} type="button" data-id={id} onClick={onSelectWidget}>
					Редактировать
				</button>
			);
		}
	};

	componentWillUnmount () {
		window.removeEventListener('resize', this.reloadGrid);
	}

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

	renderWidgetByType = (widget: Widget) => {
		if (!(widget instanceof NewWidget)) {
			return this.renderDiagram(widget);
		}
	};

	renderWidget = (widget: Widget): Element<'div'> => {
		const {id, layout} = widget;

		return (
			<div key={id} data-grid={layout} className={styles.widget}>
				{this.renderButton(id)}
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
			<div ref={this.container}>
				{this.renderGrid()}
			</div>
		);
	}
}

export default LayoutGrid;
