// @flow
import ApexCharts from 'apexcharts/dist/apexcharts';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {getLegendCroppingFormatter, getLegendWidth, getOptions, LEGEND_POSITIONS} from 'utils/chart';
import {isMacOS} from 'src/helpers';
import {KEYS, TOOLBAR_HANDLERS, ZOOM_MODES} from './constants';
import type {Props, State, ToolbarHandler, ZoomMode} from './types';
import React, {createRef, PureComponent} from 'react';
import {ResizeDetector} from 'components/molecules';
import styles from './styles.less';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import {ZoomPanel} from './components';

export class Chart extends PureComponent<Props, State> {
	chart = null;
	ref: DivRef = createRef();

	state = {
		zoomMode: ZOOM_MODES.ZOOM
	};

	componentDidMount () {
		const options = this.getOptions();
		window.addEventListener('keydown', this.handleKeydown);

		this.chart = new ApexCharts(this.ref.current, options);
		this.chart.render();
	}

	componentDidUpdate (prevProps: Props) {
		const {data: currentData} = this.props;
		const {data: prevData} = prevProps;

		if (this.chart && currentData !== prevData) {
			this.chart.updateOptions(this.getOptions());
		}
	}

	componentWillUnmount () {
		if (this.chart && typeof this.chart.destroy === 'function') {
			this.chart.destroy();
		}

		window.removeEventListener('keydown', this.handleKeydown);
	}

	getOptions = () => {
		const {data, widget} = this.props;
		const {current} = this.ref;
		let options = {};

		if (current) {
			options = getOptions(widget, data, current.clientWidth);
		}

		return options;
	};

	handleChangeZoomMode = (zoomMode: ZoomMode) => this.setState({zoomMode});

	handleKeydown = (e: SyntheticKeyboardEvent<*>) => {
		const {focused} = this.props;
		const {ctrlKey, keyCode, metaKey} = e;
		const hotkeyHeldDown = (isMacOS() && metaKey) || ctrlKey;

		if (focused && hotkeyHeldDown) {
			const {MINUS, PAGE_DOWN, PAGE_UP, PLUS, ZERO} = KEYS;
			e.preventDefault();

			if (keyCode === ZERO) {
				this.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_RESET);
			}

			if (keyCode === PLUS || keyCode === PAGE_UP) {
				this.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_IN);
			}

			if (keyCode === MINUS || keyCode === PAGE_DOWN) {
				this.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_OUT);
			}
		}
	};

	// От нажатия кнопки мыши срабатывает onDrag виджета, что ведет к некорректной работе зума
	handleMouseDown = (e: MouseEvent) => this.hasZoom() && e.stopPropagation();

	handleResize = (width: number) => {
		if (this.chart) {
			const {fontSize} = this.props.widget.legend;
			const legendWidth = getLegendWidth(width);

			// $FlowFixMe
			this.chart.updateOptions({
				legend: {
					formatter: getLegendCroppingFormatter(legendWidth, fontSize),
					width: legendWidth
				}
			});
		}
	};

	hasSideLegend = () => {
		const {legend} = this.props.widget;
		const {position, show} = legend;
		const {left, right} = LEGEND_POSITIONS;

		return show && (position === left || position === right);
	};

	hasZoom = () => {
		const {widget} = this.props;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, LINE} = WIDGET_TYPES;

		return [BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, LINE].includes(widget.type);
	};

	toolbarHandler = (handler: ToolbarHandler) => {
		if (this.chart && this.chart.toolbar && typeof this.chart.toolbar[handler] === 'function') {
			this.chart.toolbar[handler]();
		}
	};

	renderChart = () => {
		const {zoomMode} = this.state;
		const {PAN, ZOOM} = ZOOM_MODES;
		const hasZoom = this.hasZoom();
		const chartCN = cn({
			[styles.container]: true,
			[styles.panned]: hasZoom && zoomMode === PAN,
			[styles.zoomed]: hasZoom && zoomMode === ZOOM
		});

		return (
			<div className={chartCN} onMouseDown={this.handleMouseDown}>
				<div ref={this.ref} />
				{this.renderZoomPanel()}
			</div>
		);
	};

	renderChartWithResize = () => (
		<ResizeDetector onResize={this.handleResize} skipOnMount={true}>
			{this.renderChart()}
		</ResizeDetector>
	);

	renderZoomPanel = () => {
		const {zoomMode} = this.state;
		const {showSubmenu} = this.props;

		if (this.hasZoom() && !showSubmenu) {
			return (
				<div className={styles.zoomPanel}>
					<ZoomPanel
						onChangeIcon={this.handleChangeZoomMode}
						toolbarHandler={this.toolbarHandler}
						zoomMode={zoomMode}
					/>
				</div>
			);
		}
	};

	render () {
		return this.hasSideLegend() ? this.renderChartWithResize() : this.renderChart();
	}
}

export default Chart;
