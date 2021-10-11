// @flow
import {BASE_BORDER_FONT_SIZE, BASE_VALUE_FONT_SIZE, CURVE_HEIGHT, TITLE_STYLE} from './constants';
import {calcLayout, checkFontSize, getAngleByValue, normalizingRanges} from './helpers';
import cn from 'classnames';
import type {Components, Props, State} from './types';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'store/widgetForms/speedometerForm/constants';
import {LEGEND_DISPLAY_TYPES} from 'utils/chart/constants';
import {LEGEND_POSITIONS} from 'utils/chart';
import Needle from './components/Needle';
import Range from './components/Range';
import {RANGES_POSITION, TEXT_HANDLERS} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';
import Text from './components/Text';
import type {TextProps as RangeTextProps} from './components/Range/types';

export class Speedometer extends PureComponent<Props, State> {
	static defaultProps = {
		color: '#c1bdbd',
		options: {
			borders: DEFAULT_SPEEDOMETER_SETTINGS.borders,
			data: {
				formatter: value => value
			},
			ranges: DEFAULT_SPEEDOMETER_SETTINGS.ranges
		}
	};

	components: Components = {
		Needle,
		Range,
		Text
	};

	state = {
		arcX: 0,
		arcY: 0,
		fontSizeScale: 0,
		graphHeight: 0,
		graphWidth: 0,
		height: 0,
		legendHeight: 0,
		legendPosition: '',
		legendWidth: 0,
		radius: 0,
		width: 0
	};

	getComponents = () => {
		const {components} = this.props;
		return components ? {...this.components, ...components} : this.components;
	};

	handleResize = (width: number, height: number) => {
		const {options: {borders, ranges}} = this.props;
		const {style: rangesStyles = DEFAULT_SPEEDOMETER_SETTINGS.ranges.style, use: rangesUse} = ranges;
		const {legendPosition} = rangesStyles;
		const hasLegend = ranges.use && rangesStyles.show && rangesStyles.position === RANGES_POSITION.LEGEND;
		const legendInVertical = legendPosition === LEGEND_POSITIONS.left || legendPosition === LEGEND_POSITIONS.right;
		const {style: borderStyle = DEFAULT_SPEEDOMETER_SETTINGS.borders.style} = borders;

		let legendWidth = 0;
		let graphWidth = width;
		let legendHeight = 0;
		let graphHeight = height;

		if (hasLegend) {
			if (legendInVertical) {
				legendWidth = Math.round(width / 4);
				graphWidth = width - legendWidth;
				legendHeight = height;
			} else {
				legendHeight = Math.round(height / 4);
				graphHeight = height - legendHeight;
				legendWidth = width;
			}
		}

		let offsetArcX = 0;
		let offsetArcY = 0;

		if (hasLegend) {
			if (legendPosition === LEGEND_POSITIONS.left) {
				offsetArcX = legendWidth;
			}

			if (legendPosition === LEGEND_POSITIONS.top) {
				offsetArcY = legendHeight;
			}
		}

		const hasCurveText = rangesUse && rangesStyles.show && rangesStyles.position === RANGES_POSITION.CURVE;
		const curveFontSize = hasCurveText ? rangesStyles.fontSize : 0;
		const borderFontSize = borderStyle.show ? checkFontSize(borderStyle.fontSize, BASE_BORDER_FONT_SIZE) : 0;
		const layout = calcLayout(graphWidth, graphHeight, curveFontSize, borderFontSize, TITLE_STYLE.fontSize);
		const {arcX: baseArcX, arcY: baseArcY, fontSizeScale, radius} = layout;
		const arcX = baseArcX + offsetArcX;
		const arcY = baseArcY + offsetArcY;

		this.setState({arcX, arcY, fontSizeScale, graphHeight, graphWidth, height, legendHeight, legendPosition, legendWidth, radius, width});
	};

	renderBorderValue = (x: number, value: number) => {
		const {options: {borders}} = this.props;
		const {arcY, fontSizeScale} = this.state;
		const {Text} = this.getComponents();
		const {formatter, style} = borders;
		const text = formatter(value);

		style.fontSize = checkFontSize(style.fontSize, BASE_BORDER_FONT_SIZE);

		return (
			<Text
				dominantBaseline="text-before-edge"
				fontSizeScale={fontSizeScale}
				style={style}
				textAnchor="middle"
				x={x}
				y={arcY + 5}
			>
				{text}
			</Text>
		);
	};

	renderBorders = () => {
		const {options: {borders}} = this.props;
		const {arcX, radius} = this.state;
		const {max, min} = borders;

		return (
			<Fragment>
				{this.renderBorderValue(arcX - radius, min)}
				{this.renderBorderValue(arcX + radius, max)}
			</Fragment>
		);
	};

	renderLegend = () => {
		const {color, options: {borders, ranges}} = this.props;
		const {data, formatter, style, type, use} = ranges;
		const {max, min} = borders;
		const {displayType, position, show, textHandler} = style;

		if (use && show && position === RANGES_POSITION.LEGEND) {
			const {height, legendHeight, legendPosition, legendWidth, width} = this.state;
			const className = cn(styles.legend, {
				[styles.display_block]: displayType === LEGEND_DISPLAY_TYPES.BLOCK,
				[styles.display_inline]: displayType === LEGEND_DISPLAY_TYPES.INLINE,
				[styles.position_bottom]: legendPosition === LEGEND_POSITIONS.bottom,
				[styles.position_left]: legendPosition === LEGEND_POSITIONS.left,
				[styles.position_right]: legendPosition === LEGEND_POSITIONS.right,
				[styles.position_top]: legendPosition === LEGEND_POSITIONS.top,
				[styles.text_handler_crop]: textHandler === TEXT_HANDLERS.CROP,
				[styles.text_handler_wrap]: textHandler === TEXT_HANDLERS.WRAP
			});
			const style = {
				height: `${legendHeight}px`,
				width: `${legendWidth}px`
			};
			const normalizeRanges = normalizingRanges(data, type, Number.parseFloat(min), Number.parseFloat(max), color, formatter);

			return (
				<foreignObject height={height} width={width} x="0" y="0">
					<div className={className} style={style}>
						{normalizeRanges.map(this.renderLegendItem)}
					</div>
				</foreignObject>
			);
		}

		return null;
	};

	renderLegendItem = ({color, legendText}) => {
		const key = `label_${legendText}`;
		return (
			<div className={styles.legendItem} key={key}>
				<span className={styles.legendItemBox} style={{backgroundColor: color}}></span>
				<span>{legendText}</span>
			</div>
		);
	};

	renderNeedle = () => {
		const {color, options: {borders: {max, min}, data: {total}}} = this.props;
		const {arcX, arcY, radius} = this.state;
		const calcValue = (total - min) * 100 / (max - min);
		const angle = getAngleByValue(calcValue);
		const {Needle} = this.getComponents();

		return (
			<Needle color={color} radius={radius} value={angle} x={arcX} y={arcY} />
		);
	};

	renderRange = (range: Object) => {
		const {options} = this.props;
		const {arcX, arcY, fontSizeScale, radius} = this.state;
		const {ranges: {style}} = options;
		const {color, from, text, to} = range;
		const {Range} = this.getComponents();
		const startDegree = getAngleByValue(from);
		const endDegree = getAngleByValue(to);
		const {position, show} = style;
		const showTextCurve = show && position === RANGES_POSITION.CURVE && to !== 100;
		const curveText = showTextCurve ? text : null;
		const key = `${from} ${to}`;
		const components = {Text: this.renderRangeText};

		if (!isNaN(parseFloat(from)) && !isNaN(parseFloat(to)) && from < to) {
			return (
				<Range
					color={color}
					components={components}
					curveText={curveText}
					endDegree={endDegree}
					fontSizeScale={fontSizeScale}
					key={key}
					radius={radius}
					startDegree={startDegree}
					strokeWidth={radius * CURVE_HEIGHT}
					textStyle={style}
					x={arcX}
					y={arcY}
				/>
			);
		}

		return null;
	};

	renderRangeText = (props: RangeTextProps) => {
		const {options} = this.props;
		const {fontSizeScale} = this.state;
		const {ranges: {style}} = options;

		if (style.show) {
			const {Text} = this.getComponents();
			return <Text {...props} dominantBaseline="text-bottom" fontSizeScale={fontSizeScale} style={style} />;
		}

		return null;
	};

	renderRanges = (): React$Node => {
		const {color, options} = this.props;
		const {ranges: {data, type, use} = DEFAULT_SPEEDOMETER_SETTINGS.ranges, borders: {max, min}} = options;
		const formatter = options.ranges?.formatter ?? (val => val?.toString() ?? '');
		const ranges = use ? data : [];
		const normalizeRanges = normalizingRanges(ranges, type, Number.parseFloat(min), Number.parseFloat(max), color, formatter);

		return (
			<Fragment>
				{normalizeRanges.map(this.renderRange)}
			</Fragment>
		);
	};

	renderSpeedometer = () => {
		const {height, width} = this.state;
		return (
			<svg className="speedometer" height={height} width={width} xmlns="http://www.w3.org/2000/svg">
				{this.renderRanges()}
				{this.renderNeedle()}
				{this.renderLegend()}
				{this.renderBorders()}
				{this.renderTitle()}
				{this.renderValue()}
			</svg>
		);
	};

	renderTitle = () => {
		const {options: {borders, data: {title}}} = this.props;
		const {arcX, arcY, fontSizeScale, graphWidth, radius} = this.state;
		const fontSize = TITLE_STYLE.fontSize * fontSizeScale;
		const {Text} = this.getComponents();
		const borderFontSize = borders.style.show
			? checkFontSize(borders.style.fontSize, BASE_BORDER_FONT_SIZE) * fontSizeScale
			: 0;

		const y = arcY + borderFontSize + fontSize;
		let displayTitle = title;

		if (fontSize * title.length > graphWidth + radius) {
			const end = Math.round(graphWidth / fontSize) - 3;

			displayTitle = `${displayTitle.substring(0, end)}...`;
		}

		return (
			<Text
				dominantBaseline="middle"
				fontSizeScale={fontSizeScale}
				style={TITLE_STYLE}
				textAnchor="middle"
				x={arcX}
				y={y}
			>
				<title>{title}</title>
				{displayTitle}
			</Text>
		);
	};

	renderValue = () => {
		const {options: {data}} = this.props;
		const {total, formatter = val => val, style} = data;
		const {arcX, arcY, fontSizeScale, radius} = this.state;
		const y = arcY - radius * 0.6;
		const {Text} = this.getComponents();
		const formatValue = formatter(total);

		style.fontSize = checkFontSize(style.fontSize, BASE_VALUE_FONT_SIZE);

		return (
			<Text
				dominantBaseline="text-before-edge"
				fontSizeScale={fontSizeScale}
				style={style}
				textAnchor="middle"
				x={arcX}
				y={y}
			>
				{formatValue}
			</Text>
		);
	};

	render () {
		return (
			<ResizeDetector onResize={this.handleResize}>
				<div className={styles.container} ref={this.props.forwardedRef}>
					{this.renderSpeedometer()}
				</div>
			</ResizeDetector>
		);
	}
}

export default Speedometer;
