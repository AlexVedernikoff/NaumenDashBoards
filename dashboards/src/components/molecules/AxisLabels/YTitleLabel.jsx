// @flow
import React, {PureComponent} from 'react';
import type {YTitleLabelProps} from './types';

class YTitleLabel extends PureComponent<YTitleLabelProps> {
	static defaultProps = {
		color: '#000000',
		offset: 5,
		orientation: 'left'
	};

	render () {
		const {color, fontFamily, fontSize, offset, orientation, value, viewBox} = this.props;
		let {height, width, x, y} = viewBox;
		const horizontalSign = width >= 0 ? 1 : -1;
		const horizontalOffset = horizontalSign * offset;
		const angle = orientation === 'left' ? -90 : 90;

		x += orientation === 'left' ? horizontalOffset : (width - horizontalOffset);
		y += height / 2;

		const transform = `rotate(${angle}, ${x}, ${y})`;

		return (
			<text
				fill={color}
				fontFamily={fontFamily}
				fontSize={fontSize}
				offset={offset}
				textAnchor="middle"
				transform={transform}
				x={x}
				y={y}
			>
				<tspan x={x}>{value}</tspan>
			</text>
		);
	}
}

export default YTitleLabel;
