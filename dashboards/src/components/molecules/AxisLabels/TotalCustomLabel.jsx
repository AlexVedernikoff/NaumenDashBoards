// @flow
import {calculateStringsSize} from 'src/utils/recharts';
import React, {PureComponent} from 'react';
import type {TotalCustomLabelProps, TotalCustomLabelState} from './types';

const PADDING = 2;

class TotalCustomLabel extends PureComponent<TotalCustomLabelProps, TotalCustomLabelState> {
	static defaultProps = {
		fill: '',
		fontFamily: '',
		fontSize: 0,
		formatter: (value: number) => value.toString(),
		height: 0,
		index: 0,
		name: '',
		offset: 0,
		position: '',
		value: 0,
		viewBox: {
			height: 0,
			width: 0,
			x: 0,
			y: 0
		},
		width: 0,
		x: 0,
		y: 0
	};

	state = {
		height: 0,
		value: '',
		width: 0
	};

	calculateRectPosition = () => {
		const {height, type, width, x, y} = this.props;
		const {height: sHeight, width: sWidth} = this.state;
		let result = {x: 0, y: 0};

		if (type === 'columns') {
			result = {
				x: x + (width - sWidth) / 2,
				y: y + PADDING
			};
		}

		if (type === 'bars') {
			result = {
				x: x + width - sWidth - PADDING,
				y: y + (height - sHeight) / 2
			};
		}

		return result;
	};

	componentDidMount () {
		this.recalculateTextBox();
	}

	componentDidUpdate (prevProps: TotalCustomLabelProps) {
		const {fontFamily, fontSize, formatter, value} = this.props;

		if (
			value !== prevProps.value
			|| fontFamily !== prevProps.fontFamily
			|| fontSize !== prevProps.fontSize
			|| formatter !== prevProps.formatter
		) {
			this.recalculateTextBox();
		}
	}

	recalculateTextBox = () => {
		const {fontFamily, fontSize, formatter, value} = this.props;
		const formatValue = formatter ? formatter(value) : value;
		const viewValue = formatValue.toString();
		const {height, width} = calculateStringsSize([[viewValue]], fontFamily, fontSize)[0];

		this.setState({height, value: viewValue, width});
	};

	render () {
		const {fill, fontFamily, fontSize} = this.props;
		const {height, value, width} = this.state;
		const {x, y} = this.calculateRectPosition();
		const textX = x + width / 2;
		const textY = y + height / 2;

		return (
			<g>
				<rect fill="#fff" height={height} rx={PADDING} ry={PADDING} width={width} x={x} y={y} />
				<text
					dominantBaseline="central"
					fill={fill}
					fontFamily={fontFamily}
					fontSize={fontSize * 0.8}
					textAnchor="middle"
					x={textX}
					y={textY}
				>
					{value}
				</text>
			</g>
		);
	}
}

export default TotalCustomLabel;
