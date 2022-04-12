// @flow
import AxisTooltip from 'components/molecules/RechartTooltip';
import {CartesianGrid, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import t from 'localization';
import {XCategoryLabel} from 'components/molecules/AxisLabels';

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
		const fill = color(label);
		const dot = {stroke: fill, strokeWidth: 4};
		return (
			<Line
				activeDot={{
					onClick: this.handleClick(key),
					onMouseLeave: this.handleClearTooltip,
					onMouseOver: this.handleDotMouseEnter
				}}
				dataKey={key}
				dot={dot}
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
		const {options} = this.state;
		const {data, series, stackOffset} = options;
		const margin = {bottom: 5, left: 30, right: 30, top: 5};

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					<LineChart barGap={1} data={data} layout="horizontal" margin={margin} stackOffset={stackOffset}>
						<Tooltip content={this.renderTooltipContent} />
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						{this.renderXAxis()}
						{this.renderYAxis()}
						{series.map(this.renderLine)}
						{this.renderLegend()}
					</LineChart>
				</ResponsiveContainer>
			);
		}

		return null;
	};

	renderRechartLegend = () => {
		const {options: {formatters, legend}} = this.state;
		const {textHandler} = legend;

		return (
			<RechartLegend
				formatter={formatters.legend}
				textHandler={textHandler}
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
		const {options: {formatters, xaxis}} = this.state;
		const {axisName: value, fontFamily, fontSize, height, show, showName} = xaxis;

		if (show) {
			const labelStyle = showName ? {fontFamily, fontSize, offset: -3, position: 'insideBottom', value} : null;

			return (
				<XAxis
					dataKey="name"
					fontFamily={fontFamily}
					fontSize={fontSize}
					height={height}
					interval={0}
					label={labelStyle}
					tick={this.renderXAxisTick()}
					tickFormatter={formatters.parameter}
					type="category"
				/>
			);
		}

		return null;
	};

	renderXAxisTick = () => {
		const {options: {xaxis}} = this.state;
		const {fontFamily, fontSize, height, mode, showName} = xaxis;
		const tickHeight = height ? (height - (showName ? fontSize * 1.5 : 0)) : 0;

		return (
			<XCategoryLabel
				fontFamily={fontFamily}
				fontSize={fontSize}
				height={tickHeight}
				mode={mode}
			/>
		);
	};

	renderYAxis = () => {
		const {options: {formatters, yaxis}} = this.state;
		const {axisName: value, fontFamily, fontSize, show, showName, width} = yaxis;

		if (show) {
			const labelStyle = showName ? {angle: -90, fontFamily, fontSize, offset: 5, position: 'left', value} : null;

			return (
				<YAxis
					domain={[0, dataMax => Math.ceil(dataMax * 1.1)]}
					fontFamily={fontFamily}
					fontSize={fontSize}
					interval={0}
					label={labelStyle}
					tickFormatter={formatters.indicator}
					type="number"
					width={width}
				/>
			);
		}

		return null;
	};

	render () {
		const {updateOptions, widget} = this.props;
		const {data} = this.state.options;

		return (
			<ReChartWidget data={data} updateOptions={updateOptions} widget={widget}>
				{this.renderLinesChart()}
			</ReChartWidget>
		);
	}
}

export default LinesWidget;
