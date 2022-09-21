// @flow
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {darkenColor} from './helpers.js';
import EmptyWidget from 'components/molecules/EmptyWidget';
import PieLabel from './components/PieLabel';
import type {Props, State} from './types';
import ReChartWidget from 'components/molecules/ReChartWidget';
import React, {PureComponent} from 'react';
import RechartLegend from 'components/molecules/RechartLegend';
import t from 'localization';

export class PieWidget extends PureComponent<Props, State> {
	state = {
		options: {},
		tooltipColor: '#FFFFFF'
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options} = props;

		if (options.type === 'CircleChartOptions') {
			return {options};
		}

		return null;
	}

	getPieMouseEnterHandler = (fill: string) =>
		() => this.setState({tooltipColor: darkenColor(fill)});

	handleClick = (payload, idx) => {
		const {drillDown, setWidgetWarning, widget} = this.props;
		const {options: {getDrillDownOptions}} = this.state;
		const params = getDrillDownOptions(payload.name);

		if (params.mode === 'error') {
			setWidgetWarning({id: widget.id, message: t('drillDownBySelection::Fail')});
		} else if (params.mode === 'success') {
			drillDown(widget, params.index, params.mixin);
		}
	};

	renderChart = () => {
		const {options: {data}} = this.state;

		if (data) {
			return (
				<ResponsiveContainer height="100%" width="100%">
					{this.renderPieChart()}
				</ResponsiveContainer>
			);
		}

		return null;
	};

	renderLabel = props => {
		const {options: {dataLabels, formatters}} = this.state;
		return (
			<PieLabel
				{...props}
				formatter={formatters.label}
				style={dataLabels}
			/>
		);
	};

	renderLegend = () => {
		const {options: {data, legend}} = this.state;

		if (legend && legend.show) {
			const {align, height, layout, style, verticalAlign, width} = legend;
			const payload = data.map(({color, name}) => ({color, type: 'rect', value: name}));

			return (
				<Legend
					align={align}
					content={this.renderRechartLegend()}
					height={height}
					layout={layout}
					payload={payload}
					verticalAlign={verticalAlign}
					width={width}
					wrapperStyle={{padding: '5px', ...style}}
				/>
			);
		}

		return null;
	};

	renderPie = data => {
		const {hiddenSeries} = this.props;
		const {options: {innerRadius}} = this.state;
		const showData = data.filter(item => !hiddenSeries.includes(item.name));

		return (
			<Pie
				data={showData}
				dataKey="value"
				innerRadius={innerRadius}
				isAnimationActive={false}
				label={this.renderLabel}
				labelLine={false}
				onClick={this.handleClick}
			>
				{showData.map(this.renderPieCell)}
			</Pie>
		);
	};

	renderPieCell = (item, idx) => (
		<Cell fill={item.color} key={`cell-${idx}`} onMouseOver={this.getPieMouseEnterHandler(item.color.toString())} />
	);

	renderPieChart = () => {
		const {widget} = this.props;
		const {options: {data, formatters}, tooltipColor} = this.state;
		const formatter = (value, name, props) => [formatters.label(value), formatters.category(name)];
		const contentStyle = {backgroundColor: tooltipColor, padding: '5px'};
		const itemStyle = {color: '#FFFFFF'};

		if (data.length !== 0) {
			return (
				<PieChart>
					<Tooltip contentStyle={contentStyle} formatter={formatter} itemStyle={itemStyle} />
					{this.renderPie(data)}
					{this.renderLegend()}
				</PieChart>
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
				formatter={formatters.category}
				hiddenSeries={hiddenSeries}
				style={style}
				textHandler={textHandler}
				toggleSeriesShow={toggleSeriesShow}
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

export default PieWidget;
