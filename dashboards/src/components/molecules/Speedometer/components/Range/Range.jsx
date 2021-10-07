// @flow
import {polarToCartesian} from 'components/molecules/Speedometer/helpers';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';

class Range extends PureComponent<Props> {
	components = {
		Text: this.renderTextNode
	};

	describeArc = (startAngle: number, endAngle: number) => {
		const {radius, x, y} = this.props;
		const start = polarToCartesian(x, y, radius, endAngle);
		const end = polarToCartesian(x, y, radius, startAngle);

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

	getComponents = () => {
		const {components} = this.props;
		return components ? {...this.components, ...components} : this.components;
	};

	renderArc = () => {
		const {color, endDegree, startDegree, strokeWidth} = this.props;

		return (
			<path
				d={this.describeArc(startDegree, endDegree)}
				fill="none"
				stroke={color}
				strokeWidth={strokeWidth}
			/>
		);
	};

	renderText = () => {
		const {curveText, endDegree, radius, strokeWidth, x, y} = this.props;

		if (curveText) {
			const shift = strokeWidth * 0.5 + 5;
			const {x: cx, y: cy} = polarToCartesian(x, y, radius + shift, endDegree);
			let anchor = 'middle';

			if (endDegree < -5) {
				anchor = 'end';
			} else if (endDegree > 5) {
				anchor = 'start';
			}

			const {Text} = this.getComponents();

			return (
				<Text
					key={`range_text_${endDegree}`}
					textAnchor={anchor}
					x={cx}
					y={cy}
				>
					<title>{curveText}</title>
					{curveText}
				</Text>
			);
		}

		return null;
	};

	renderTextNode = () => null;

	render () {
		return (
			<Fragment>
				{this.renderArc()}
				{this.renderText()}
			</Fragment>
		);
	}
}

export default Range;
