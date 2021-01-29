// @flow
import {BASE_FONT_SIZES, BASE_RADIUS, DEFAULT_SPEEDOMETER_SETTINGS, END_DEGREE, START_DEGREE} from './constants';
import type {Props, State, TextValueProps} from './types';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {PureComponent} from 'react';
import {ResizeDetector} from 'components/molecules';
import styles from './styles.less';

export class Speedometer extends PureComponent<Props, State> {
	static defaultProps = {
		color: '#c1bdbd',
		max: 100,
		min: 0,
		ranges: DEFAULT_SPEEDOMETER_SETTINGS.ranges
	};

	components = {
		TextValue: this.renderTextValue
	};

	state = {
		arcWidth: 0,
		arcX: 0,
		arcY: 0,
		fontSizeScale: 0,
		height: 0,
		radius: 0,
		width: 0
	};

	describeArc = (startAngle: number, endAngle: number) => {
		const {arcX: x, arcY: y, radius} = this.state;
		const start = this.polarToCartesian(x, y, radius, endAngle);
		const end = this.polarToCartesian(x, y, radius, startAngle);

		return [
			'M',
			start.x,
			start.y,
			'A',
			radius,
			radius,
			0,
			0,
			0,
			end.x,
			end.y
		].join(' ');
	};

	getAngleByValue = (value: number) => {
		const {max, min} = this.props;
		const angle = Math.round(180 / (max - min) * (Number(value) - min)) - 90;

		return Math.min(Math.max(START_DEGREE, angle), END_DEGREE);
	};

	getComponents = () => {
		const {components} = this.props;
		return components ? {...this.components, ...components} : this.components;
	};

	handleResize = (width: number, height: number) => {
		const arcWidth = Math.round(width / 2 > height ? height * 2 : width);
		const radius = Math.round(arcWidth / 3);
		const fontSizeScale = Number((radius / BASE_RADIUS).toFixed(1));
		const arcX = Math.round(width / 2);
		const arcY = Math.round(height / 2 + radius / 3);

		this.setState({arcWidth, arcX, arcY, fontSizeScale, height, radius, width});
	};

	polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
		const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians)
		};
	};

	renderArc = (startDegree: number, endDegree: number, color: string = this.props.color) => {
		const strokeWidth = this.state.height * 0.1;

		return (
			<path
				d={this.describeArc(startDegree, endDegree)}
				fill="none"
				stroke={color}
				strokeWidth={strokeWidth}
			/>
		);
	};

	renderBorderValue = (x: number, value: number) => {
		const {arcY, fontSizeScale} = this.state;
		const fontSize = BASE_FONT_SIZES.BORDER_FONT_SIZE * fontSizeScale;
		const y = arcY + fontSize;

		return (
			<text
				fontSize={fontSize}
				fontWeight="bold"
				textAnchor="middle"
				x={x}
				y={y}
			>
				{value}
			</text>
		);
	};

	renderNeedle = () => {
		const {color, value} = this.props;
		const {height, radius, width} = this.state;
		const needleWidth = width / 2 - radius / 2 + 100;
		const x = width / 2 - (needleWidth * 0.5);
		const y = height / 2 - (radius * 0.1);
		const angle = this.getAngleByValue(value);

		return (
			<svg height={radius} viewBox="0 0 20 200" width={needleWidth} x={x} y={y}>
				<g fill={color}>
					<path
						d="M13.89 84.24L2.83 83.88c0 0 3.65-70.77 3.96-74.98C7.1 4.56 7.83 0 8.53 0c0.7 0 1.75 4.27 2.05 8.89C10.88 13.52 13.89 84.24 13.89 84.24z"
						transform={`rotate(${angle}, 8, 85)`}
					>
						<animateTransform
							attributeName="transform"
							dur="0.8s"
							from="-90 8 85"
							to={`${angle} 8 85`}
							type="rotate"
						/>
					</path>
					<path d="M16.72 85.48c0 4.62-3.74 8.36-8.36 8.36S0 90.09 0 85.48c0-4.62 3.74-8.36 8.36-8.36S16.72 80.86 16.72 85.48z" />
					<circle cx="8.43" cy="85.47" fill="white" r="2.69" />
				</g>
			</svg>
		);
	};

	renderRange = (range: Object) => {
		const {max, min, ranges} = this.props;
		const {type} = ranges;
		let {color, from, to} = range;

		if (type === RANGES_TYPES.PERCENT) {
			const diff = max - min;

			from = min + Math.round(diff / 100 * from);
			to = min + Math.round(diff / 100 * to);
		} else {
			from = Math.max(from, min);
			to = Math.min(to, max);
		}

		if (!isNaN(parseFloat(from)) && !isNaN(parseFloat(to)) && from < to) {
			return this.renderArc(this.getAngleByValue(from), this.getAngleByValue(to), color);
		}

		return null;
	};

	renderRanges = (): Array<React$Node> | null => {
		const {data, use} = this.props.ranges;
		return use ? data.map(this.renderRange) : null;
	};

	renderSpeedometer = () => {
		const {max, min} = this.props;
		const {arcX, height, radius, width} = this.state;

		if (height > 0 && width > 0) {
			return (
				<svg className="speedometer" height={height} width={width} xmlns="http://www.w3.org/2000/svg">
					{this.renderArc(START_DEGREE, END_DEGREE)}
					{this.renderRanges()}
					{this.renderBorderValue(arcX - radius, min)}
					{this.renderBorderValue(arcX + radius, max)}
					{this.renderTitle()}
					{this.renderNeedle()}
					{this.renderValue()}
				</svg>
			);
		}

		return null;
	};

	renderTextValue (props: TextValueProps) {
		return <text {...props} />;
	}

	renderTitle = () => {
		const {title} = this.props;
		const {arcX, arcY, fontSizeScale, radius, width} = this.state;
		const fontSize = BASE_FONT_SIZES.TITLE_FONT_SIZE * fontSizeScale;
		const y = arcY + fontSize * 3;
		let displayTitle = title;

		if (fontSize * title.length > width + radius) {
			const end = Math.round(width / fontSize) - 3;
			displayTitle = `${displayTitle.substring(0, end)}...`;
		}

		return (
			<text
				fontSize={fontSize}
				fontWeight="bold"
				textAnchor="middle"
				x={arcX}
				y={y}
			>
				<title>{title}</title>
				{displayTitle}
			</text>
		);
	};

	renderValue = () => {
		const {value} = this.props;
		const {arcX, arcY, fontSizeScale, radius} = this.state;
		const fontSize = BASE_FONT_SIZES.VALUE_FONT_SIZE * fontSizeScale;
		const y = arcY - radius * 0.6;
		const {TextValue} = this.getComponents();

		return (
			<TextValue
				alignmentBaseline="middle"
				fontSize={fontSize}
				textAnchor="middle"
				x={arcX}
				y={y}
			>
				{value}
			</TextValue>
		);
	};

	render () {
		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={styles.container}>
					{this.renderSpeedometer()}
				</div>
			</ResizeDetector>
		);
	}
}

export default Speedometer;
