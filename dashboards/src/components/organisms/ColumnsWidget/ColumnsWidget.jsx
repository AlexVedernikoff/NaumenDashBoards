// @flow
import AxisTooltip from 'components/molecules/RechartTooltip';
import {Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import BarLabel from 'components/molecules/BarLabel';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import t from 'localization';
import {XCategoryLabel} from 'components/molecules/AxisLabels';

export class ColumnsWidget extends PureComponent<Props, State> {
	state = {
		options: {},
		tooltip: null
	};

	getHandleBarMouseEnter = (key: string, fill: string) => (data, idx) => {
		const {options: {formatters}} = this.state;

		this.setState({
			tooltip: {
				fill,
				indicator: formatters.parameter(data.name),
				parameter: formatters.parameter(key),
				value: formatters.tooltip(data[key])
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
		const {stackId} = this.state.options;
		const fill = color(label);

		return (
			<Bar
				dataKey={key}
				fill={fill}
				isAnimationActive={false}
				key={key}
				onClick={this.handleClick(key)}
				onMouseEnter={this.getHandleBarMouseEnter(key, fill)}
				onMouseLeave={this.handleClearTooltip}
				stackId={stackId}
			>
				{this.renderDataLabels(key)}
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

	renderColumnsChart = () => {
		const {options} = this.state;
		const {data, series, stackOffset} = options;
		const margin = {bottom: 5, left: 30, right: 30, top: 5};

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					<BarChart barGap={1} data={data} layout="horizontal" margin={margin} stackOffset={stackOffset}>
						<Tooltip content={this.renderTooltipContent} />
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						{this.renderXAxis()}
						{this.renderYAxis()}
						{series.map(this.renderBar)}
						{this.renderLegend()}
					</BarChart>
				</ResponsiveContainer>
			);
		}

		return null;
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
					content={<BarLabel />}
					dataKey={key}
					fill={fontColor}
					fontFamily={fontFamily}
					fontSize={fontSize}
					formatter={formatters.dataLabel}
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
		const {formatters, xaxis} = this.state.options;
		const {axisName: value, fontFamily, fontSize, height, show, showName} = xaxis;

		if (show) {
			const labelStyle = showName ? {fontFamily, fontSize, offset: -3, position: 'insideBottom', value} : null;
			const yPadding = fontSize * 0.25;

			return (
				<XAxis
					dataKey="name"
					dy={yPadding}
					fontFamily={fontFamily}
					fontSize={fontSize}
					height={height}
					interval={0}
					label={labelStyle}
					tick={this.renderXCategoryLabel()}
					tickFormatter={formatters.parameter}
					type="category"
				/>
			);
		}

		return null;
	};

	renderXCategoryLabel = () => {
		const {xaxis} = this.state.options;
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
		const {formatters, yaxis} = this.state.options;
		const {axisName: value, fontFamily, fontSize, show, showName, width} = yaxis;

		if (show) {
			const labelStyle = showName ? {angle: -90, fontFamily, fontSize, offset: 5, position: 'left', value} : null;

			return (
				<YAxis
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
		const {data, updateOptions, widget} = this.props;

		return (
			<ReChartWidget data={data} updateOptions={updateOptions} widget={widget}>
				{this.renderColumnsChart()}
			</ReChartWidget>
		);
	}
}

export default ColumnsWidget;
