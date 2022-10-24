// @flow
import cn from 'classnames';
import {DEFAULT_COMPARE_PERIOD, FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import SummaryTooltip from 'components/molecules/Summary/components/SummaryTooltip';
import WidgetTooltip from 'components/molecules/WidgetTooltip';

const START_AUTO_FONT_SIZE = 32;

export class Summary extends Component<Props, State> {
	state = {
		fontSize: 0,
		forwardedRef: null,
		height: 0,
		tooltipPosition: null,
		visibility: false
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {forwardedRef} = props;
		return {forwardedRef: forwardedRef ?? createRef()};
	}

	componentDidMount () {
		const {fontSize} = this.props;
		let calcFontSize = 0;

		if (fontSize === FONT_SIZE_AUTO_OPTION) {
			calcFontSize = START_AUTO_FONT_SIZE;
		} else if (typeof fontSize === 'string') {
			calcFontSize = parseFloat(fontSize);
		} else {
			calcFontSize = fontSize;
		}

		this.setState({
			fontSize: calcFontSize
		});
	}

	getValue = () => {
		const {options} = this.props;
		const {data, value} = options;
		return data?.formatter?.(value) ?? value;
	};

	handleClearTooltip = () => this.setState({tooltipPosition: null});

	handleResize = (width: number, height: number) => {
		const {fontSize, forwardedRef} = this.state;

		if (forwardedRef) {
			const {current: element} = forwardedRef;

			if (element) {
				const children = Array.from(element.children);
				let lowerFontSize = 0;
				let upperFontSize = fontSize > 0 ? fontSize : START_AUTO_FONT_SIZE;
				const getMaxWidth = () => children.reduce((max, item) => Math.max(item.scrollWidth ?? 0, max), 0);
				const getSumHeight = () => children.reduce((sum, item) => sum + (item.scrollHeight ?? 0), 0);

				const isContains = fontSize => {
					element.style.fontSize = `${fontSize}px`;
					return getMaxWidth() < width && getSumHeight() < height;
				};

				// смотрим когда upperFontSize не перестанет влезать на виджет
				while (isContains(upperFontSize)) {
					lowerFontSize = upperFontSize;
					upperFontSize = upperFontSize * 2;
				}

				// бинарный поиск от downFontSize до upperFontSize размера шрифта
				while ((upperFontSize - lowerFontSize) > 1) {
					const mean = Math.ceil((upperFontSize + lowerFontSize) / 2);

					if (isContains(mean)) {
						lowerFontSize = mean;
					} else {
						upperFontSize = mean;
					}
				}

				if (lowerFontSize < 19) {
					lowerFontSize = 19;
				}

				this.setState({fontSize: lowerFontSize, visibility: true});
			}
		}
	};

	handleTooltipShow = ({clientX: x, clientY: y}: MouseEvent) => this.setState({tooltipPosition: {x, y}});

	renderContent = () => {
		const {color, fontFamily, fontSize: fontSizeProps, fontStyle} = this.props;
		const {fontSize, forwardedRef, visibility} = this.state;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const containerCN = cn({
			[styles.container]: true,
			[styles.containerHidden]: fontSizeProps === FONT_SIZE_AUTO_OPTION && !visibility,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE
		});

		const style = {
			color,
			fontFamily,
			fontSize: `${fontSize}px`
		};

		return (
			<div className={containerCN} ref={forwardedRef} style={style}>
				{this.renderValue(fontSize)}
				{false && this.renderDiffValue() /* SMRMEXT-12334 */}
				{false && this.renderDiffTooltip() /* SMRMEXT-12334 */}
			</div>
		);
	};

	renderDiffTooltip = () => {
		const {options} = this.props;
		const {diff} = options;
		const {tooltipPosition} = this.state;

		if (diff && tooltipPosition) {
			const {x, y} = tooltipPosition;
			const {indicator, period, value} = diff;
			const valueStr = value > 0 ? `+${value}` : value.toString();
			return <SummaryTooltip indicator={indicator} period={period} value={valueStr} x={x} y={y} />;
		}

		return null;
	};

	renderDiffValue = () => {
		const {options} = this.props;
		const {data, diff, style} = options;

		if (diff) {
			const {down = DEFAULT_COMPARE_PERIOD.format.down, up = DEFAULT_COMPARE_PERIOD.format.up} = style?.diff ?? {};
			const {percent} = diff;
			const diffValue = data?.diffFormatter?.(percent) ?? percent;
			const glyphIcon = diff.value < 0 ? '↓' : '↑';
			const glyphColor = diff.value < 0 ? down : up;

			if (diffValue) {
				return (
					<div
						className={styles.diffValue}
						onClick={this.props.onClickDiff}
						onMouseLeave={this.handleClearTooltip}
						onMouseMove={this.handleTooltipShow}
					>
						<span style={{color: glyphColor}}>
							{glyphIcon}
						</span>
						{diffValue}
					</div>
				);
			}
		}

		return null;
	};

	renderValue = (fontSize: number) => {
		const {onClickValue, options: {data: {tooltip}}} = this.props;
		const {height: textHeight} = this.state;
		const style = {
			height: textHeight > 0 ? `${textHeight}px` : 'auto'
		};

		return (
			<span
				className={styles.value}
				onClick={onClickValue}
				style={style}
			>
				{this.getValue()}
				<WidgetTooltip className={styles.tooltip} tooltip={tooltip} />
			</span>
		);
	};

	renderWithResize = () => (
		<ResizeDetector fontSize={this.state.fontSize} onResize={this.handleResize}>
			{this.renderContent()}
		</ResizeDetector>
	);

	render () {
		const {fontSize} = this.props;

		if (fontSize === FONT_SIZE_AUTO_OPTION) {
			return this.renderWithResize();
		}

		return this.renderContent();
	}
}

export default Summary;
