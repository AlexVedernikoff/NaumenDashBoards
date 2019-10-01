// @flow
import {breakpoints, cols, rowHeight} from 'utils/layout/constants';
import Chart from 'components/molecules/Chart';
import type {ContainerRef, Props, State} from './types';
import type {Element} from 'react';
import {NewWidget} from 'entities';
import React, {Component} from 'react';
import {Responsive as Grid} from 'react-grid-layout';
import styles from './styles.less';
import type {Widget} from 'store/widgets/data/types';

const props = {
	autoSize: undefined,
	breakpoint: undefined,
	className: undefined,
	containerPadding: undefined,
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
		}
	}

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

	renderChart = (widget: Widget | NewWidget) => {
		const {charts} = this.props;

		if (!(widget instanceof NewWidget)) {
			return <Chart widget={widget} data={charts[widget.id]}/>;
		}
	};

	renderWidget = (widget: Widget): Element<'div'> => {
		const {id, layout} = widget;

		return (
			<div key={id} data-grid={layout} className={styles.widget}>
				{this.renderButton(id)}
				{this.renderChart(widget)}
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
					compactType={null}
					breakpoints={breakpoints}
					cols={cols}
					onLayoutChange={onLayoutChange}
					rowHeight={rowHeight}
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
