// @flow
import {calculateStringsSize} from 'src/utils/recharts';
import type {CategoryLabelProps, CategoryLabelState} from './types';
import {LABEL_DRAW_MODE} from 'utils/recharts/constants';
import React, {PureComponent} from 'react';

class YCategoryLabel extends PureComponent<CategoryLabelProps, CategoryLabelState> {
	state = {
		trimString: ''
	};

	static defaultProps = {
		className: '',
		fill: '#666',
		height: 0,
		index: 0,
		mode: LABEL_DRAW_MODE.SINGLELINE,
		orientation: 'left',
		stroke: 'none',
		textAnchor: 'end',
		type: 'category',
		verticalAnchor: 'middle',
		visibleTicksCount: 9,
		width: 0,
		x: 0,
		y: 0
	};

	componentDidMount () {
		const {mode} = this.props;

		if (mode === LABEL_DRAW_MODE.TRIM) {
			this.calculateTrimString();
		}
	}

	componentDidUpdate (prevProps: CategoryLabelProps) {
		const {mode, payload, width} = this.props;

		if (mode === prevProps.mode || payload.value !== prevProps.payload.value || width !== prevProps.width) {
			this.calculateTrimString();
		}
	}

	calculateTrimString = () => {
		const {fontFamily, fontSize, payload, tickFormatter, width} = this.props;
		const value = tickFormatter(payload.value);
		const strings = [];

		for (let i = 0; i < value.length - 4; i++) {
			strings.push([value.slice(0, i + 1) + '...']);
		}

		strings.push([value]);

		const sizes = calculateStringsSize(strings, fontFamily, fontSize);
		const findIndex = sizes.findIndex(item => item.width > width);
		let trimString = value;

		if (findIndex !== -1) {
			if (findIndex === 0) {
				trimString = '...';
			} else {
				trimString = strings[findIndex - 1][0];
			}
		}

		this.setState({trimString});
	};

	getRenderMultiLineLine = (x: number) => (line: string, idx: number) => {
		const dy = idx > 0 ? '1em' : null;
		return <tspan dy={dy} key={idx} x={x}>{line}</tspan>;
	};

	renderMultiLine = () => {
		const {payload, tickFormatter, verticalAnchor, visibleTicksCount, x, y, ...props} = this.props;
		const value = tickFormatter(payload.value);
		const lines = value.split(' ');

		return (
			<g>
				<text {...props} alignmentBaseline="middle" textAnchor="end" x={x} y={y}>
					{lines.map(this.getRenderMultiLineLine(x))}
					<title>{value}</title>
				</text>
			</g>
		);
	};

	renderOneLine = () => {
		const {payload, tickFormatter, verticalAnchor, visibleTicksCount, ...props} = this.props;
		const value = tickFormatter(payload.value);

		return (
			<g>
				<text {...props} alignmentBaseline="middle" textAnchor="end">
					{value}
					<title>{value}</title>
				</text>
			</g>
		);
	};

	renderTrim = () => {
		const {payload, tickFormatter, verticalAnchor, visibleTicksCount, ...props} = this.props;
		const value = tickFormatter(payload.value);
		const {trimString} = this.state;

		return (
			<g>
				<text {...props} alignmentBaseline="middle" textAnchor="end">
					<tspan>
						{trimString}
						<title>{value}</title>
					</tspan>
				</text>
			</g>
		);
	};

	render () {
		const {mode} = this.props;

		if (mode === LABEL_DRAW_MODE.SINGLELINE) {
			return this.renderOneLine();
		} else if (mode === LABEL_DRAW_MODE.MULTILINE) {
			return this.renderMultiLine();
		} else if (mode === LABEL_DRAW_MODE.TRIM) {
			return this.renderTrim();
		}

		return null;
	}
}

export default YCategoryLabel;
