// @flow
import type {AbsoluteElementProps} from 'components/molecules/DynamicRelativeContainer/types';
import ApexCharts from 'apexcharts/dist/apexcharts';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {DynamicRelativeContainer, ResizeDetector} from 'components/molecules';
import {getLegendCroppingFormatter, getLegendWidth, getOptions, LEGEND_POSITIONS} from 'utils/chart';
import {isMacOS} from 'src/helpers';
import {KEY_CODES, TOOLBAR_HANDLERS, ZOOM_MODES} from './constants';
import type {Props, State, ToolbarHandler, ZoomMode} from './types';
import React, {createRef, PureComponent} from 'react';
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

		if (options) {
			window.addEventListener('keydown', this.handleKeydown);

			this.chart = new ApexCharts(this.ref.current, options);
			this.chart.render();
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {data: currentData} = this.props;
		const {data: prevData} = prevProps;

		if (currentData !== prevData) {
			const options = this.getOptions();
			options && this.chart && this.chart.updateOptions(options);
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
		let options;

		if (current) {
			options = getOptions(widget, data, current.clientWidth);
		}

		return options;
	};

	handleChangeZoomMode = (zoomMode: ZoomMode) => this.setState({zoomMode});

	handleKeydown = (e: SyntheticKeyboardEvent<*>) => {
		const {focused} = this.props;
		// $FlowFixMe
		const {code, ctrlKey, keyCode, metaKey} = e;

		const hotkeyHeldDown = (isMacOS() && metaKey) || ctrlKey;

		if (focused && hotkeyHeldDown) {
			const {
				MINUS,
				MINUS_KEY,
				NUM_DOWN,
				NUM_DOWN_KEY,
				NUM_PLUS,
				NUM_PLUS_KEY,
				NUM_ZERO,
				NUM_ZERO_KEY,
				PLUS,
				PLUS_KEY,
				ZERO,
				ZERO_KEY
			} = KEY_CODES;
			e.preventDefault();

			if (code === ZERO || code === NUM_ZERO || keyCode === ZERO_KEY || keyCode === NUM_ZERO_KEY) {
				this.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_RESET);
			}

			if (code === PLUS || code === NUM_PLUS || keyCode === PLUS_KEY || keyCode === NUM_PLUS_KEY) {
				this.toolbarHandler(TOOLBAR_HANDLERS.ZOOM_IN);
			}

			if (code === MINUS || code === NUM_DOWN || keyCode === MINUS_KEY || keyCode === NUM_DOWN_KEY) {
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

	mixinResize = (chart: React$Node) => (
		<ResizeDetector className={styles.container} onResize={this.handleResize} skipOnMount={true}>
			{chart}
		</ResizeDetector>
	);

	mixinZoom = (chart: React$Node) => {
		const {zoomMode} = this.state;
		const {PAN, ZOOM} = ZOOM_MODES;
		const hasZoom = this.hasZoom();
		const chartCN = cn({
			[styles.container]: true,
			[styles.panned]: hasZoom && zoomMode === PAN,
			[styles.zoomed]: hasZoom && zoomMode === ZOOM
		});

		return (
			<DynamicRelativeContainer
				className={chartCN}
				onMouseDown={this.handleMouseDown}
				renderAbsoluteElement={this.renderZoomPanel}
			>
				{chart}
			</DynamicRelativeContainer>
		);
	};

	toolbarHandler = (handler: ToolbarHandler) => {
		if (this.chart && this.chart.toolbar && typeof this.chart.toolbar[handler] === 'function') {
			this.chart.toolbar[handler]();
		}
	};

	renderZoomPanel = (props: AbsoluteElementProps) => {
		const {showSubmenu} = this.props;
		const {zoomMode} = this.state;
		const {className, ref, top} = props;

		if (!showSubmenu) {
			return (
				<div className={cn(styles.zoomPanel, className)} ref={ref} style={{top}}>
					<ZoomPanel
						onChangeIcon={this.handleChangeZoomMode}
						toolbarHandler={this.toolbarHandler}
						zoomMode={zoomMode}
					/>
				</div>
			);
		}

		return null;
	};

	render () {
		let chart = <div className={styles.chart} ref={this.ref} />;

		if (this.hasZoom()) {
			chart = this.mixinZoom(chart);
		}

		if (this.hasSideLegend()) {
			chart = this.mixinResize(chart);
		}

		return chart;
	}
}

export default Chart;
