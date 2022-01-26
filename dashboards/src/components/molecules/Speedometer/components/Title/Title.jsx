// @flow
import type {Components, Props, State} from './types';
import Message from 'components/molecules/WidgetTooltip/components/Message';
import React, {Fragment, PureComponent} from 'react';
import Text from 'components/molecules/Speedometer/components/Text';

export class Title extends PureComponent<Props, State> {
	tooltipPositionTimer = null;

	components: Components = {
		Text
	};

	state = {
		tooltipPosition: null
	};

	getComponents = () => {
		const {components} = this.props;
		return components ? {...this.components, ...components} : this.components;
	};

	handleClearTooltip = () => {
		clearTimeout(this.tooltipPositionTimer);
		this.setState({tooltipPosition: null});
	};

	handleTooltipShow = (e: MouseEvent) => {
		const {clientX: x, clientY: y} = e;

		clearTimeout(this.tooltipPositionTimer);
		this.tooltipPositionTimer = setTimeout(() => this.setState({tooltipPosition: {x, y}}), 300);
	};

	renderDefaultTooltip = () => {
		const {title, tooltip} = this.props;

		if (!tooltip) {
			return (<title>{title}</title>);
		}

		return null;
	};

	renderTitle = () => {
		const {title} = this.props;

		return (
			<tspan>
				{this.renderDefaultTooltip()}
				{title}
			</tspan>
		);
	};

	renderTooltip = () => {
		const {tooltip} = this.props;
		const {tooltipPosition} = this.state;

		if (tooltip) {
			const textStyle = {
				color: '#4D92C8',
				fontSize: '0.84em'
			};

			return (
				<Fragment>
					&nbsp;
					<tspan
						baselineShift='25%'
						fill={textStyle.color}
						fontSize={textStyle.fontSize}
						style={textStyle}
					>
					[?]
					</tspan>
					<Message position={tooltipPosition} text={tooltip} />
				</Fragment>
			);
		}

		return null;
	};

	render () {
		const {centerX, fontSizeScale, style, y} = this.props;
		const {Text} = this.getComponents();

		return (
			<Text
				dominantBaseline="middle"
				fontSizeScale={fontSizeScale}
				onMouseLeave={this.handleClearTooltip}
				onMouseMove={this.handleTooltipShow}
				style={style}
				textAnchor="middle"
				x={centerX}
				y={y}
			>
				{this.renderTitle()}
				{this.renderTooltip()}
			</Text>
		);
	}
}

export default Title;
