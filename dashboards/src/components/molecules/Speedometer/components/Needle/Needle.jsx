// @flow
import {CURVE_HEIGHT} from 'components/molecules/Speedometer/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';

class Needle extends PureComponent<Props> {
	render () {
		const {color, radius, value, x, y} = this.props;
		const mul = (radius * (1 + CURVE_HEIGHT / 2) + 10) / 100;
		const fx = (val) => val * mul + x;
		const fy = (val) => val * mul + y;
		const path = [
			'M', fx(-2.5), fy(0),
			'C', fx(-2.5), fy(0), fx(-1.75), fy(-86), fx(-1.5), fy(-90),
			'C', fx(-1.5), fy(-94), fx(-1.75), fy(-100), fx(0), fy(-100),
			'C', fx(1.75), fy(-100), fx(1.5), fy(-94), fx(1.5), fy(-90),
			'C', fx(1.5), fy(-86), fx(2.5), fy(0), fx(2.5), fy(0),
			'z'
		].join(' ');

		return (
			<svg>
				<g fill={color}>
					<path d={path} transform={`rotate(${value}, ${x}, ${y})`}>
						<animateTransform
							attributeName="transform"
							begin="0.3s"
							dur="0.8s"
							from={`-90 ${x} ${y}`}
							to={`${value} ${x} ${y}`}
							type="rotate"
						/>
					</path>
					<circle cx={x} cy={y} r={4 * mul} />
					<circle cx={x} cy={y} fill="#ffffff" r={2 * mul} />
				</g>
			</svg>
		);
	}
}

export default Needle;
