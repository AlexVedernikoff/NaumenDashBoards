// @flow
import {BASE_BORDER_FONT_SIZE, BASE_VALUE_FONT_SIZE, CURVE_HEIGHT, TITLE_STYLE} from './constants';
import {calcLayout, checkFontSize, getAngleByValue, normalizingRanges} from './helpers';
import type {Components, Props, State} from './types';
import * as CSS from './css';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'store/widgetForms/speedometerForm/constants';
import {LEGEND_DISPLAY_TYPES, LEGEND_POSITIONS} from 'utils/recharts/constants';
import Needle from './components/Needle';
import Range from './components/Range';
import {RANGES_POSITION, TEXT_HANDLERS} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import Text from './components/Text';
import type {TextProps as RangeTextProps} from './components/Range/types';
import Title from './components/Title';

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
		indicatorTooltipX: 0,
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

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options: {borders, ranges, size: {height, width}}} = props;

		if (state.width !== width || state.height !== height) {
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
					legendHeight = height - 30;
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
			const curveFontSize = hasCurveText ? checkFontSize(rangesStyles.fontSize, DEFAULT_SPEEDOMETER_SETTINGS.ranges.style.fontSize) : 0;
			const borderFontSize = borderStyle.show ? checkFontSize(borderStyle.fontSize, BASE_BORDER_FONT_SIZE) : 0;
			const layout = calcLayout(graphWidth, graphHeight, curveFontSize, borderFontSize, TITLE_STYLE.fontSize);
			const {arcX: baseArcX, arcY: baseArcY, fontSizeScale, radius} = layout;
			const arcX = baseArcX + offsetArcX;
			const arcY = baseArcY + offsetArcY;

			return {arcX, arcY, fontSizeScale, graphHeight, graphWidth, height, legendHeight, legendPosition, legendWidth, radius, width};
		}

		return null;
	}

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
		const {displayType, fontFamily, fontSize, position, show, textHandler} = style;

		if (use && show && position === RANGES_POSITION.LEGEND) {
			const {height, legendHeight, legendPosition, legendWidth, width} = this.state;
			let classStyle = CSS.LEGEND;
			let inlineHorizontal = false;
			const textHandlerCrop = textHandler === TEXT_HANDLERS.CROP;
			const textHandlerWrap = textHandler === TEXT_HANDLERS.WRAP;

			if (legendPosition === LEGEND_POSITIONS.bottom) {
				classStyle = {...classStyle, ...CSS.POSITION_BOTTOM};
			} else if (legendPosition === LEGEND_POSITIONS.left) {
				classStyle = {...classStyle, ...CSS.POSITION_LEFT};
			} else if (legendPosition === LEGEND_POSITIONS.right) {
				classStyle = {...classStyle, ...CSS.POSITION_RIGHT};
			}

			if ((legendPosition === LEGEND_POSITIONS.bottom || legendPosition === LEGEND_POSITIONS.top) && (displayType === LEGEND_DISPLAY_TYPES.INLINE)) {
				classStyle = {...classStyle, ...CSS.DISPLAY_INLINE_HORIZONTAL};
				inlineHorizontal = true;
			}

			const style = {
				fontFamily,
				fontSize,
				height: `${legendHeight}px`,
				width: `${legendWidth}px`,
				...classStyle
			};
			const normalizeRanges = normalizingRanges(data, type, Number.parseFloat(min), Number.parseFloat(max), color, formatter);

			return (
				<foreignObject height={height} width={width} x="0" y="0">
					<div style={style}>
						{normalizeRanges.map(this.renderLegendItem(inlineHorizontal, textHandlerCrop, textHandlerWrap))}
					</div>
				</foreignObject>
			);
		}

		return null;
	};

	renderLegendItem = (inlineHorizontal: boolean, crop: boolean, wrap: boolean) => {
		let styles = CSS.LEGEND_ITEM;

		if (inlineHorizontal) {
			styles = {...styles, ...CSS.DISPLAY_INLINE_HORIZONTAL_ITEM};
		}

		if (crop) {
			styles = {...styles, ...CSS.CROP_LEGEND_ITEM};
		}

		if (wrap) {
			styles = {...styles, ...CSS.WRAP_LEGEND_ITEM};
		}

		return ({color, legendText}) => {
			const key = `label_${legendText}`;
			const stylesBox = {...CSS.LEGEND_ITEM_BOX, backgroundColor: color};
			return (
				<div key={key} style={styles}>
					<span style={stylesBox}></span>
					<span>{legendText}</span>
				</div>
			);
		};
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

	renderTitle = () => {
		const {options: {borders, data: {title, tooltip}}} = this.props;
		const {arcX, arcY, fontSizeScale, graphWidth, radius} = this.state;
		const fontSize = TITLE_STYLE.fontSize * fontSizeScale;
		const borderFontSize = borders.style.show
			? checkFontSize(borders.style.fontSize, BASE_BORDER_FONT_SIZE) * fontSizeScale
			: 0;
		const y = arcY + borderFontSize + fontSize;

		return (
			<Title
				centerX={arcX}
				fontSizeScale={fontSizeScale}
				style={TITLE_STYLE}
				title={title}
				tooltip={tooltip}
				width={graphWidth + radius}
				y={y}
			/>
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
		const {height, width} = this.state;
		return (
			<div className={styles.container}>
				<svg className="speedometer" height={height} width={width} xmlns="http://www.w3.org/2000/svg">
					{this.renderRanges()}
					{this.renderNeedle()}
					{this.renderLegend()}
					{this.renderBorders()}
					{this.renderTitle()}
					{this.renderValue()}
				</svg>
			</div>
		);
	}
}

export default Speedometer;
