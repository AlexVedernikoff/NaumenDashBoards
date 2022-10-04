// @flow
import AxisTooltip from 'components/molecules/RechartTooltip';
import {Bar, CartesianGrid, ComposedChart, LabelList, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import BarLabel from 'components/molecules/BarLabel';
import {COMBO_TYPES} from 'store/widgets/data/constants';
import EmptyWidget from 'components/molecules/EmptyWidget';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import t from 'localization';
import {XCategoryLabel, YTitleLabel} from 'components/molecules/AxisLabels';

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

	getBarMouseEnterHandler = (key: string, label: string, fill: string) => {
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

	getDotMouseEnterHandler = (key: string, label: string, fill: string) => {
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
		const {hiddenSeries} = this.props;
		const id = `${key} ${label}`;
		const hide = hiddenSeries.includes(label);

		return (
			<Bar
				dataKey={id}
				fill={color}
				hide={hide}
				isAnimationActive={false}
				key={id}
				name={label}
				onClick={this.handleBarClick(key, label)}
				onMouseEnter={this.getBarMouseEnterHandler(key, label, color)}
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

	renderChart = () => {
		const {options: {data}} = this.state;

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					{this.renderComboChart()}
				</ResponsiveContainer>
			);
		}

		return null;
	};

	renderComboChart = () => {
		const {widget} = this.props;
		const {options: {data, series, yaxis}} = this.state;
		const margin = {bottom: 5, left: 30, right: 30, top: 5};
		const {COLUMN, COLUMN_STACKED, LINE} = COMBO_TYPES;
		const typesOrder = {[COLUMN]: 1, [COLUMN_STACKED]: 0, [LINE]: 2};
		const sortedSeries = series.sort((rowA, rowB) =>
			typesOrder[rowA.type ?? COLUMN] - typesOrder[rowB.type ?? COLUMN]
		);

		if (data.length !== 0) {
			return (
				<ComposedChart data={data} margin={margin} >
					<Tooltip content={this.renderTooltipContent} />
					<CartesianGrid strokeDasharray="3 3" />
					{this.renderXAxis()}
					{yaxis.map(this.renderYAxis)}
					{sortedSeries.map(this.renderSeries)}
					{this.renderLegend()}
				</ComposedChart>
			);
		}

		return <EmptyWidget widget={widget} />;
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
		const {hiddenSeries} = this.props;
		const id = `${key} ${label}`;
		const dot = {stroke: color, strokeWidth: 4};
		const hide = hiddenSeries.includes(label);

		return (
			<Line
				activeDot={{
					onClick: this.handleDotClick(key, label),
					onMouseLeave: this.handleClearTooltip,
					onMouseOver: this.getDotMouseEnterHandler(key, label, color)
				}}
				dataKey={id}
				dot={dot}
				hide={hide}
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
		const {hiddenSeries, toggleSeriesShow} = this.props;
		const {options: {formatters, legend}} = this.state;
		const {style, textHandler} = legend;

		return (
			<RechartLegend
				comboFormatter={formatters.legend}
				hiddenSeries={hiddenSeries}
				style={style}
				textHandler={textHandler}
				toggleSeriesShow={toggleSeriesShow}
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
		const {axisName: value, fontFamily, fontSize, height, interval, show, showName} = xaxis;
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
		const orientation = idx === 0 ? 'left' : 'right';
		const label = showName
			? (
				<YTitleLabel
					color={color}
					fontFamily={fontFamily}
					fontSize={fontSize}
					offset={fontSize}
					orientation={orientation}
					value={value}
				/>
			)
			: null;

		return (
			<YAxis
				domain={[min, max]}
				fontFamily={fontFamily}
				fontSize={fontSize}
				hide={!show}
				interval={0}
				key={dataKey}
				label={label}
				orientation={orientation}
				stroke={color}
				tickFormatter={formatters.indicator(dataKey)}
				type="number"
				width={width}
				yAxisId={dataKey}
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

export default ComboWidget;
