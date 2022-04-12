// @flow
import AxisTooltip from 'components/molecules/RechartTooltip';
import {Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import BarLabel from 'components/molecules/BarLabel';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import t from 'localization';
import {YCategoryLabel} from 'components/molecules/AxisLabels';

export class BarWidget extends PureComponent<Props, State> {
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

	handleClick = key => data => {
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
		const {options: {stackId}} = this.state;
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

	renderBarCell = (fill: string, key: string) =>
		<Cell cursor="pointer" fill={fill} key={key} />;

	renderBarCells = (color: Function, dataKey: string, labels: ?Array<string>, idx: number) => {
		let result = null;

		if (labels) {
			result = labels.map(label => this.renderBarCell(color(label, idx), `cell ${dataKey} ${label}`));
		}

		return result;
	};

	renderBarChart = () => {
		const {options} = this.state;
		const {data, series, stackOffset} = options;
		const margin = {bottom: 5, left: 30, right: 30, top: 5};

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					<BarChart barGap={1} data={data} layout="vertical" margin={margin} stackOffset={stackOffset}>
						<Tooltip content={this.renderTooltipContent} />
						<CartesianGrid horizontal={false} strokeDasharray="3 3" />
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
		const {options: {dataLabels, formatters}} = this.state;
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
		const {options: {formatters, xaxis}} = this.state;
		const {axisName: value, fontFamily, fontSize, show, showName} = xaxis;

		if (show) {
			const labelStyle = showName ? {fontFamily, fontSize, offset: -3, position: 'insideBottom', value} : null;

			return (
				<XAxis
					fontFamily={fontFamily}
					fontSize={fontSize}
					interval={0}
					label={labelStyle}
					tickFormatter={formatters.indicator}
					type="number"
				/>
			);
		}

		return null;
	};

	renderYAxis = () => {
		const {options: {formatters, yaxis}} = this.state;
		const {axisName, fontFamily, fontSize, show, showName, width} = yaxis;

		if (show) {
			const labelStyle = showName ? {angle: -90, fontFamily, fontSize, offset: 5, position: 'left', value: axisName} : null;

			return (
				<YAxis
					dataKey="name"
					interval={0}
					label={labelStyle}
					tick={this.renderYAxisTick()}
					tickFormatter={formatters.parameter}
					type="category"
					width={width}
				/>
			);
		}

		return null;
	};

	renderYAxisTick = () => {
		const {options: {yaxis}} = this.state;
		const {fontFamily, fontSize, mode, showName, width} = yaxis;
		const tickWidth = width ? (width - (showName ? fontSize * 1.5 : 0)) : 0;

		return (
			<YCategoryLabel
				fontFamily={fontFamily}
				fontSize={fontSize}
				mode={mode}
				width={tickWidth}
			/>
		);
	};

	render () {
		const {data, updateOptions, widget} = this.props;

		return (
			<ReChartWidget data={data} updateOptions={updateOptions} widget={widget}>
				{this.renderBarChart()}
			</ReChartWidget>
		);
	}
}

export default BarWidget;
