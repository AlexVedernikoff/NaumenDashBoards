// @flow
import AxisTooltip from 'components/molecules/RechartTooltip';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Customized,
	LabelList,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';
import EmptyWidget from 'components/molecules/EmptyWidget';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import {StoreLabel, StoredLabels} from 'containers/LabelsStorage';
import {SUB_TOTAL_POSITION} from 'utils/recharts/constants';
import t from 'localization';
import {TotalCustomLabel, XCategoryLabel, YTitleLabel} from 'components/molecules/AxisLabels';

export class ColumnsWidget extends PureComponent<Props, State> {
	state = {
		options: {},
		tooltip: null
	};

	getBarMouseEnterHandler = (key: string, fill: string) => (data, idx) => {
		const {options: {formatters}} = this.state;

		this.setState({
			tooltip: {
				fill,
				indicator: formatters.parameter(data.name),
				parameter: formatters.parameter(key),
				value: formatters.tooltip(data[key], data)
			}
		});
	};

	handleClearTooltip = () => {
		this.setState({tooltip: null});
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options} = props;

		if (options.type === 'AxisChartOptions') {
			return {options};
		}

		return null;
	}

	handleClick = (key: string) => (data, idx) => {
		const {drillDown, setWidgetWarning, widget} = this.props;
		const {options: {getDrillDownOptions}} = this.state;
		const params = getDrillDownOptions(data.name, key);

		if (params.mode === 'error') {
			setWidgetWarning({id: widget.id, message: t('drillDownBySelection::Fail')});
		} else if (params.mode === 'success') {
			drillDown(widget, params.index, params.mixin);
		}
	};

	renderBar = ({breakdownLabels, color, key, label}, idx) => {
		const {hiddenSeries} = this.props;
		const {stackId} = this.state.options;
		const fill = color(label);
		const hide = hiddenSeries.includes(key);

		return (
			<Bar
				dataKey={key}
				fill={fill}
				hide={hide}
				isAnimationActive={false}
				key={key}
				onClick={this.handleClick(key)}
				onMouseEnter={this.getBarMouseEnterHandler(key, fill)}
				onMouseLeave={this.handleClearTooltip}
				stackId={stackId}
			>
				{this.renderDataLabels(key)}
				{this.renderTotalDataLabels(idx)}
				{this.renderBarCells(color, key, breakdownLabels, idx) }
			</Bar>
		);
	};

	renderBarCells = (color: Function, key: string, labels: ?Array<string>, idx: number) => {
		let result = null;

		if (labels) {
			result = labels.map(
				(label, index) => <Cell cursor="pointer" fill={color(label, idx)} key={`cell ${key} ${label}`} />
			);
		}

		return result;
	};

	renderChart = () => {
		const {options: {data}} = this.state;

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					{this.renderColumnsChart()}
				</ResponsiveContainer>
			);
		}

		return null;
	};

	renderColumnsChart = () => {
		const {clearLabels, widget} = this.props;
		const {options} = this.state;
		const {data, series, stackOffset} = options;
		const margin = {bottom: 5, left: 30, right: 30, top: 5};

		if (data.length !== 0) {
			clearLabels && clearLabels();

			return (
				<BarChart barGap={1} data={data} layout="horizontal" margin={margin} stackOffset={stackOffset}>
					<Tooltip content={this.renderTooltipContent} />
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					{this.renderXAxis()}
					{this.renderYAxis()}
					{series.map(this.renderBar)}
					<Customized component={<StoredLabels />} />
					{this.renderLegend()}
				</BarChart>
			);
		}

		return <EmptyWidget widget={widget} />;
	};

	renderDataLabels = (key: string) => {
		const {dataLabels, formatters} = this.state.options;
		const {fontColor, fontFamily, fontSize, show, showShadow} = dataLabels;

		if (show) {
			// класс rechart_dataLabels_shadow объявлен глобально в стилях ReChartWidget
			const showClassName = showShadow ? 'rechart_dataLabels_shadow' : '';

			return (
				<LabelList
					className={showClassName}
					content={
						<StoreLabel dataKey={key} force={true} formatter={formatters.dataLabel} />
					}
					dataKey={key}
					fill={fontColor}
					fontFamily={fontFamily}
					fontSize={fontSize}
					position="center"
				/>
			);
		}

		return null;
	};

	renderLegend = () => {
		const {options: {legend}} = this.state;

		if (legend && legend.show) {
			const {align, height, layout, style, verticalAlign, width} = legend;

			return (
				<Legend
					align={align}
					content={this.renderRechartLegend()}
					height={height}
					layout={layout}
					verticalAlign={verticalAlign}
					width={width}
					wrapperStyle={{padding: '5px', ...style}}
				/>
			);
		}
	};

	renderRechartLegend = () => {
		const {hiddenSeries, toggleSeriesShow} = this.props;
		const {options: {formatters, legend}} = this.state;
		const {style, textHandler} = legend;

		return (
			<RechartLegend
				formatter={formatters.legend}
				hiddenSeries={hiddenSeries}
				style={style}
				textHandler={textHandler}
				toggleSeriesShow={toggleSeriesShow}
			/>
		);
	};

	renderTooltipContent = props => {
		const {tooltip} = this.state;
		const show = tooltip !== null;

		return (
			<AxisTooltip
				show={show}
				{...props}
				{...tooltip}
			/>
		);
	};

	renderTotalDataLabels = idx => {
		const {dataLabels, formatters, series, subTotalGetter} = this.state.options;
		const {fontFamily, fontSize} = dataLabels;

		if (subTotalGetter && idx === series.length - 1) {
			const {getter, position} = subTotalGetter;
			const content = position === SUB_TOTAL_POSITION.OUTER ? null : <TotalCustomLabel type="columns" />;
			const labelPosition = position === SUB_TOTAL_POSITION.OUTER ? 'top' : 'insideTop';

			return (
				<LabelList
					content={content}
					fontFamily={fontFamily}
					fontSize={fontSize}
					formatter={formatters.totalDataLabel}
					position={labelPosition}
					valueAccessor={({name}) => getter(name) }
				/>
			);
		}

		return null;
	};

	renderXAxis = () => {
		const {formatters, xAxis} = this.state.options;
		const {axisName: value, fontFamily, fontSize, height, interval, show, showName} = xAxis;
		const labelStyle = showName
			? {fontFamily, fontSize, height, offset: -3, position: 'insideBottom', value}
			: null;
		const yPadding = fontSize * 0.25;

		return (
			<XAxis
				dataKey="name"
				dy={yPadding}
				fontFamily={fontFamily}
				fontSize={fontSize}
				height={height}
				hide={!show}
				interval={interval}
				label={labelStyle}
				tick={this.renderXCategoryLabel()}
				tickFormatter={formatters.parameter}
				type="category"
			/>
		);
	};

	renderXCategoryLabel = () => {
		const {xAxis} = this.state.options;
		const {fontFamily, fontSize, height, mode, multilineLabels, showName} = xAxis;
		const tickHeight = height ? (height - (showName ? fontSize * 1.5 : 0)) : 0;

		return (
			<XCategoryLabel
				fontFamily={fontFamily}
				fontSize={fontSize}
				height={tickHeight}
				mode={mode}
				multilineLabels={multilineLabels}
			/>
		);
	};

	renderYAxis = () => {
		const {formatters, yAxis} = this.state.options;
		const {axisName: value, domain, fontFamily, fontSize, show, showName, width} = yAxis;
		const label = showName
			? <YTitleLabel fontFamily={fontFamily} fontSize={fontSize} value={value} />
			: null;

		return (
			<YAxis
				domain={domain}
				fontFamily={fontFamily}
				fontSize={fontSize}
				hide={!show}
				interval={0}
				label={label}
				tickFormatter={formatters.indicator}
				type="number"
				width={width}
			/>
		);
	};

	render () {
		const {data, updateOptions, widget} = this.props;

		return (
			<ReChartWidget data={data} updateOptions={updateOptions} widget={widget}>
				{this.renderChart()}
			</ReChartWidget>
		);
	}
}

export default ColumnsWidget;
