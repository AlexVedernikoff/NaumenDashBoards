// @flow
import AxisTooltip from 'components/molecules/RechartTooltip';
import {CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import EmptyWidget from 'components/molecules/EmptyWidget';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import t from 'localization';
import {XCategoryLabel, YTitleLabel} from 'components/molecules/AxisLabels';

export class LinesWidget extends PureComponent<Props, State> {
	state = {
		options: {},
		tooltip: null
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options} = props;

		if (options.type === 'AxisChartOptions') {
			return {options};
		}

		return null;
	}

	handleClearTooltip = () => {
		this.setState({tooltip: null});
	};

	handleClick = (key: string) => (dot, data, idx) => {
		const {drillDown, setWidgetWarning, widget} = this.props;
		const {options: {getDrillDownOptions}} = this.state;
		const params = getDrillDownOptions(data.payload.name, key);

		if (params.mode === 'error') {
			setWidgetWarning({id: widget.id, message: t('drillDownBySelection::Fail')});
		} else if (params.mode === 'success') {
			drillDown(widget, params.index, params.mixin);
		}
	};

	handleDotMouseEnter = (e, data) => {
		const {options: {formatters}} = this.state;
		const {dataKey, fill, payload: {name}, value} = data;

		this.setState({
			tooltip: {
				fill,
				indicator: formatters.parameter(name),
				parameter: formatters.parameter(dataKey),
				value: formatters.tooltip(value)
			}
		});
	};

	renderChart = () => {
		const {options: {data}} = this.state;

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					{this.renderLinesChart()}
				</ResponsiveContainer>
			);
		}

		return null;
	};

	renderDataLabels = (key: string) => {
		const {options: {dataLabels, formatters}} = this.state;
		const {fontColor, fontFamily, fontSize, show, showShadow} = dataLabels;

		if (show) {
			// класс rechart_dataLabels_shadow объявлен глобально в стилях ReChartWidget
			const showClassName = showShadow ? 'rechart_dataLabels_shadow' : '';

			return (
				<LabelList
					className={showClassName}
					dataKey={key}
					fill={fontColor}
					fontFamily={fontFamily}
					fontSize={fontSize}
					formatter={formatters.dataLabel}
					position="top"
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

	renderLine = ({breakdownLabels, color, key, label}, idx) => {
		const {hiddenSeries} = this.props;
		const fill = color(label);
		const dot = {stroke: fill, strokeWidth: 4};
		const hide = hiddenSeries.includes(key);

		return (
			<Line
				activeDot={{
					onClick: this.handleClick(key),
					onMouseLeave: this.handleClearTooltip,
					onMouseOver: this.handleDotMouseEnter
				}}
				dataKey={key}
				dot={dot}
				hide={hide}
				isAnimationActive={false}
				key={key}
				stroke={fill}
				strokeWidth={4}
				type="linear"
			>
				{this.renderDataLabels(key)}
			</Line>
		);
	};

	renderLinesChart = () => {
		const {widget} = this.props;
		const {options} = this.state;
		const {data, series, stackOffset} = options;
		const margin = {bottom: 5, left: 30, right: 30, top: 5};

		if (data.length !== 0) {
			return (
				<LineChart barGap={1} data={data} layout="horizontal" margin={margin} stackOffset={stackOffset}>
					<Tooltip content={this.renderTooltipContent} />
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					{this.renderXAxis()}
					{this.renderYAxis()}
					{series.map(this.renderLine)}
					{this.renderLegend()}
				</LineChart>
			);
		}

		return <EmptyWidget widget={widget} />;
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

	renderXAxis = () => {
		const {options: {formatters, xAxis}} = this.state;
		const {axisName: value, fontFamily, fontSize, height, interval, show, showName} = xAxis;
		const labelStyle = showName
			? {fontFamily, fontSize, offset: -3, position: 'insideBottom', value}
			: null;

		return (
			<XAxis
				dataKey="name"
				fontFamily={fontFamily}
				fontSize={fontSize}
				height={height}
				hide={!show}
				interval={interval}
				label={labelStyle}
				tick={this.renderXAxisTick()}
				tickFormatter={formatters.parameter}
				type="category"
			/>
		);
	};

	renderXAxisTick = () => {
		const {options: {xAxis}} = this.state;
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
		const {options: {formatters, yAxis}} = this.state;
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

export default LinesWidget;
