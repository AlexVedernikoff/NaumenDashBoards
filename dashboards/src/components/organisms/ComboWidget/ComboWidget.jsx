// @flow
import AxisTooltip from 'components/molecules/RechartTooltip';
import {Bar, CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import BarLabel from 'components/molecules/BarLabel';
import {COMBO_TYPES} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import t from 'localization';
import {XCategoryLabel} from 'components/molecules/AxisLabels';

export class ComboWidget extends PureComponent<Props, State> {
	state = {
		options: {},
		tooltip: null
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options} = props;

		if (options.type === 'ComboChartOptions') {
			return {options};
		}

		return null;
	}

	getHandleBarMouseEnter = (key: string, label: string, fill: string) => {
		const {options: {formatters}} = this.state;
		const parameterFormatter = formatters.parameter;
		const valueFormatter = formatters.dataLabel(key);
		const parameter = formatters.parameter(label);
		const id = `${key} ${label}`;

		return (data, idx) => {
			this.setState({
				tooltip: {
					fill,
					indicator: parameterFormatter(data.name),
					parameter,
					value: valueFormatter(data[id])
				}
			});
		};
	};

	getHandleDotMouseEnter = (key: string, label: string, fill: string) => {
		const {options: {formatters}} = this.state;
		const parameterFormatter = formatters.parameter;
		const valueFormatter = formatters.dataLabel(key);
		const parameter = formatters.parameter(label);

		return (e, data) => {
			const {payload: {name}, value} = data;

			this.setState({
				tooltip: {
					fill,
					indicator: parameterFormatter(name),
					parameter,
					value: valueFormatter(value)
				}
			});
		};
	};

	handleBarClick = (dataKey, label) => (payload, idx) => this.handleDrillDown(dataKey, payload.name, label);

	handleClearTooltip = () => {
		this.setState({tooltip: null});
	};

	handleDotClick = (dataKey, label) => (dot, payload) => this.handleDrillDown(dataKey, payload.payload.name, label);

	handleDrillDown = (dataKey, parameterValue, breakdownValue) => {
		const {drillDown, setWidgetWarning, widget} = this.props;
		const {options: {getDrillDownOptions}} = this.state;
		const params = getDrillDownOptions(dataKey, parameterValue, breakdownValue);

		if (params.mode === 'error') {
			setWidgetWarning({id: widget.id, message: t('drillDownBySelection::Fail')});
		} else if (params.mode === 'success') {
			drillDown(widget, params.index, params.mixin);
		}
	};

	renderBar = ({color, key, label}, stackId: string | null) => {
		const id = `${key} ${label}`;

		return (
			<Bar
				dataKey={id}
				fill={color}
				isAnimationActive={false}
				key={id}
				name={label}
				onClick={this.handleBarClick(key, label)}
				onMouseEnter={this.getHandleBarMouseEnter(key, label, color)}
				onMouseLeave={this.handleClearTooltip}
				stackId={stackId}
				yAxisId={key}
			>
				{this.renderDataLabels(key, id, true)}
			</Bar>
		);
	};

	renderLegend () {
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

		return null;
	}

	renderComboChart = () => {
		const {options: {data, series, yaxis}} = this.state;
		const margin = {bottom: 5, left: 30, right: 30, top: 5};

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					<ComposedChart data={data} margin={margin} >
						<Tooltip content={this.renderTooltipContent} />
						<CartesianGrid strokeDasharray="3 3" />
						{this.renderXAxis()}
						{yaxis.map(this.renderYAxis)}
						{series.map(this.renderSeries)}
						{this.renderLegend()}
					</ComposedChart>
				</ResponsiveContainer>
			);
		}

		return null;
	};

	renderDataLabels = (dataKey: string, id: string, isBar: boolean) => {
		const {dataLabels, formatters} = this.state.options;
		const {fontColor, fontFamily, fontSize, show, showShadow} = dataLabels;

		if (show) {
			// класс rechart_dataLabels_shadow объявлен глобально в стилях ReChartWidget
			const showClassName = showShadow ? 'rechart_dataLabels_shadow' : '';
			const position = isBar ? 'center' : 'top';
			const label = isBar ? (<BarLabel />) : null;

			return (
				<LabelList
					className={showClassName}
					content={label}
					dataKey={id}
					fill={fontColor}
					fontFamily={fontFamily}
					fontSize={fontSize}
					formatter={formatters.dataLabel(dataKey)}
					position={position}
				/>
			);
		}

		return null;
	};

	renderLine = ({color, key, label}) => {
		const id = `${key} ${label}`;
		const dot = {stroke: color, strokeWidth: 4};
		return (
			<Line
				activeDot={{
					onClick: this.handleDotClick(key, label),
					onMouseLeave: this.handleClearTooltip,
					onMouseOver: this.getHandleDotMouseEnter(key, label, color)
				}}
				dataKey={id}
				dot={dot}
				isAnimationActive={false}
				key={id}
				name={label}
				stroke={color}
				strokeWidth={4}
				type="linear"
				yAxisId={key}
			>
				{this.renderDataLabels(key, id, false)}
			</Line>
		);
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

	renderSeries = row => {
		const {type} = row;
		const {COLUMN, COLUMN_STACKED, LINE} = COMBO_TYPES;

		switch (type) {
			case COLUMN:
				return this.renderBar(row, null);
			case COLUMN_STACKED:
				return this.renderBar(row, row.key);
			case LINE:
				return this.renderLine(row);
			default:
				return null;
		}
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
		const {fontFamily, fontSize, height, mode, multilineLabels, showName} = xaxis;
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

	renderYAxis = (yaxis, idx) => {
		const {options: {formatters}} = this.state;
		const {axisName: value, color, dataKey, fontFamily, fontSize, max, min, show, showName, width} = yaxis;

		if (show) {
			let labelStyle = null;
			const orientation = idx === 0 ? 'left' : 'right';

			if (showName) {
				labelStyle = idx === 0
					? {angle: -90, fontFamily, fontSize, offset: fontSize, position: 'insideLeft', value}
					: {angle: 90, fontFamily, fontSize, offset: fontSize, position: 'insideRight', value};
			}

			return (
				<YAxis
					domain={[min, max]}
					fontFamily={fontFamily}
					fontSize={fontSize}
					interval={0}
					key={dataKey}
					label={labelStyle}
					orientation={orientation}
					stroke={color}
					tickFormatter={formatters.indicator(dataKey)}
					type="number"
					width={width}
					yAxisId={dataKey}
				/>
			);
		}

		return null;
	};

	render () {
		const {data, updateOptions, widget} = this.props;

		return (
			<ReChartWidget data={data} updateOptions={updateOptions} widget={widget}>
				{this.renderComboChart()}
			</ReChartWidget>
		);
	}
}

export default ComboWidget;
