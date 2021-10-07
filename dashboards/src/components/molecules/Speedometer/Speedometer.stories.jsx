import React from 'react';
import Speedometer from './Speedometer';

const DEFAULT_PROPS = {
	color: '#c1bdbd',
	options: {
		borders: {
			max: 2000,
			min: 0
		},
		data: {formatter: (val) => val},
		ranges: {
			data: [{
				// использовать шестнадцатеричное представление, т.к. по нему рассчитывается яркость
				color: '#ffffff',
				from: 0,
				to: 100
			}],
			style: {
				displayType: 'BLOCK',
				fontFamily: 'Roboto',
				fontSize: 16,
				legendPosition: 'right',
				position: 'LEGEND',
				show: false,
				textHandler: 'CROP'
			},
			type: 'PERCENT',
			use: false
		},
		title: 'Уникальный идентификатор',
		value: 995
	}
};

export default {
	component: Speedometer,
	title: 'Molecules/Speedometer'
};

const Template = args => (<div style={{height: 300, width: 300}}><Speedometer {...args} /></div>);
const WideTemplate = args => (<div style={{height: 300, width: 700}}><Speedometer {...args} /></div>);

export const Simple = Template.bind({});

Simple.args = {
	...DEFAULT_PROPS
};

export const WithRanges = Template.bind({});

WithRanges.args = {
	...DEFAULT_PROPS,
	options: {
		...DEFAULT_PROPS.options,
		ranges: {
			...DEFAULT_PROPS.options.ranges,
			data: [
				{color: '#990f0f', from: 0, to: 500},
				{color: '#0f30b4', from: 500, to: 1000}
			],
			type: 'ABSOLUTE',
			use: true
		}
	}
};

export const WithRangesCurve = Template.bind({});

WithRangesCurve.args = {
	...DEFAULT_PROPS,
	options: {
		...DEFAULT_PROPS.options,
		ranges: {
			...DEFAULT_PROPS.options.ranges,
			data: [
				{color: '#990f0f', from: 0, to: 500},
				{color: '#0f30b4', from: 500, to: 1000}
			],
			style: {
				...DEFAULT_PROPS.options.ranges.style,
				position: 'CURVE',
				show: true
			},
			type: 'ABSOLUTE',
			use: true
		}
	}
};

export const WithRightLegend = WideTemplate.bind({});

WithRightLegend.args = {
	...DEFAULT_PROPS,
	options: {
		...DEFAULT_PROPS.options,
		ranges: {
			...DEFAULT_PROPS.options.ranges,
			data: [
				{color: '#990f0f', from: 0, to: 500},
				{color: '#0f30b4', from: 500, to: 1000}
			],
			style: {
				...DEFAULT_PROPS.options.ranges.style,
				legendPosition: 'right',
				position: 'LEGEND',
				show: true
			},
			type: 'ABSOLUTE',
			use: true

		}
	}
};

export const WithBottomLegend = Template.bind({});

WithBottomLegend.args = {
	...DEFAULT_PROPS,
	options: {
		...DEFAULT_PROPS.options,
		ranges: {
			...DEFAULT_PROPS.options.ranges,
			data: [
				{color: '#990f0f', from: 0, to: 500},
				{color: '#0f30b4', from: 500, to: 1000}
			],
			style: {
				...DEFAULT_PROPS.options.ranges.style,
				legendPosition: 'bottom',
				position: 'LEGEND',
				show: true
			},
			type: 'ABSOLUTE',
			use: true
		}
	}
};

export const WithTopLegend = Template.bind({});

WithTopLegend.args = {
	...DEFAULT_PROPS,
	options: {
		...DEFAULT_PROPS.options,
		ranges: {
			...DEFAULT_PROPS.options.ranges,
			data: [
				{color: '#990f0f', from: 0, to: 500},
				{color: '#0f30b4', from: 500, to: 1000}
			],
			style: {
				...DEFAULT_PROPS.options.ranges.style,
				legendPosition: 'top',
				position: 'LEGEND',
				show: true
			},
			type: 'ABSOLUTE',
			use: true
		}
	}
};

export const WithLeftLegend = WideTemplate.bind({});

WithLeftLegend.args = {
	...DEFAULT_PROPS,
	options: {
		...DEFAULT_PROPS.options,
		ranges: {
			...DEFAULT_PROPS.options.ranges,
			data: [
				{color: '#990f0f', from: 0, to: 500},
				{color: '#0f30b4', from: 500, to: 1000}
			],
			style: {
				...DEFAULT_PROPS.options.ranges.style,
				legendPosition: 'left',
				position: 'LEGEND',
				show: true
			},
			type: 'ABSOLUTE',
			use: true
		}
	}
};
