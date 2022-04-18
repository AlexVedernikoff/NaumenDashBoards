// @flow
import {calculateStringsSize} from 'src/utils/recharts';
import type {CategoryLabelProps, CategoryLabelState} from './types';
import {LABEL_DRAW_MODE} from 'utils/recharts/constants';
import React, {PureComponent} from 'react';

const R_COS_60 = Math.sqrt(3) / 2; // обратный косинус от 60

class XCategoryLabel extends PureComponent<CategoryLabelProps, CategoryLabelState> {
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

		if (mode === LABEL_DRAW_MODE.ROTATE) {
			this.calculateTrimString();
		}
	}

	componentDidUpdate (prevProps: CategoryLabelProps) {
		const {mode, payload, width} = this.props;

		if (mode === prevProps.mode || payload.value !== prevProps.payload.value || width !== prevProps.width) {
			if (mode === LABEL_DRAW_MODE.ROTATE) {
				this.calculateTrimString();
			}
		}
	}

	calculateTrimString = () => {
		const {fontFamily, fontSize, height, payload, tickFormatter} = this.props;
		const rotateHeight = height * R_COS_60;
		const value = tickFormatter(payload.value);
		const strings = [];

		for (let i = 0; i < value.length - 4; i++) {
			strings.push([value.slice(0, i + 1) + '...']);
		}

		strings.push([value]);

		const sizes = calculateStringsSize(strings, fontFamily, fontSize);
		const findIndex = sizes.findIndex(item => item.width > rotateHeight);
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
		const {index, multilineLabels, payload, tickFormatter, verticalAnchor, visibleTicksCount, y, ...props} = this.props;
		const {fontSize, x} = props;
		const value = tickFormatter(payload.value);
		const lines = multilineLabels?.[index] ?? value.split(' ');
		const normalizeY = y + fontSize / 2;

		return (
			<g>
				<text {...props} alignmentBaseline="middle" textAnchor='middle' y={normalizeY}>
					{lines.map(this.getRenderMultiLineLine(x))}
					<title>{value}</title>
				</text>
			</g>
		);
	};

	renderOneLine = () => {
		const {multilineLabels, payload, tickFormatter, verticalAnchor, visibleTicksCount, ...props} = this.props;
		const value = tickFormatter(payload.value);

		return (
			<g>
				<text {...props} alignmentBaseline="middle" textAnchor="middle">
					{value}
					<title>{value}</title>
				</text>
			</g>
		);
	};

	renderRotate = () => {
		const {multilineLabels, payload, tickFormatter, verticalAnchor, visibleTicksCount, ...props} = this.props;
		const {trimString} = this.state;
		const value = tickFormatter(payload.value);
		const {x, y} = props;
		const transform = `rotate(-60 ${x} ${y})`;

		return (
			<g>
				<text {...props} alignmentBaseline="middle" textAnchor="end" transform={transform}>
					{trimString}
					<title>{value}</title>
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
		} else if (mode === LABEL_DRAW_MODE.ROTATE) {
			return this.renderRotate();
		}

		return null;
	}
}

export default XCategoryLabel;
