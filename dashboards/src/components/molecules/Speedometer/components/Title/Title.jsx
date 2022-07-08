// @flow
import type {Components, Props} from './types';
import React, {forwardRef, PureComponent} from 'react';
import Text from 'components/molecules/Speedometer/components/Text';
import WidgetTooltip from 'components/molecules/WidgetTooltip';

export class Title extends PureComponent<Props> {
	tooltipPositionTimer = null;

	components: Components = {
		Text
	};

	getComponents = () => {
		const {components} = this.props;
		return components ? {...this.components, ...components} : this.components;
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

	renderTooltipIcon = (props, ref) => {
		const {children, onClick} = props;
		const textStyle = {
			color: '#4D92C8',
			fontSize: '0.84em'
		};

		return (
			<tspan
				baselineShift="25%"
				fill={textStyle.color}
				fontSize={textStyle.fontSize}
				onClick={onClick}
				ref={ref}
				style={textStyle}
			>
				{children}
			</tspan>
		);
	};

	render () {
		const {centerX, fontSizeScale, style, tooltip, y} = this.props;
		const {Text} = this.getComponents();

		return (
			<Text
				dominantBaseline="middle"
				fontSizeScale={fontSizeScale}
				style={style}
				textAnchor="middle"
				x={centerX}
				y={y}
			>
				{this.renderTitle()}
				<WidgetTooltip
					components={{
						Icon: forwardRef(this.renderTooltipIcon)
					}}
					tooltip={tooltip}
				/>
			</Text>
		);
	}
}

export default Title;
