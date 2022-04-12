// @flow
import {calculateStringsSize} from 'src/utils/recharts';
import {Label} from 'recharts';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class BarLabel extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		fontFamily: 'Roboto',
		fontSize: 12,
		height: 0,
		name: '',
		value: 0,
		viewBox: {height: 0, width: 0, x: 0, y: 0},
		width: 0,
		x: 0,
		y: 0
	};

	render () {
		const {content, ...props} = this.props;
		const {fontFamily, fontSize, formatter, height, value, width} = props;

		if (height > 1 && width > 1) { // Проверка на нулевые области
			const text = formatter ? formatter(value) : value.toString();

			const sizes = calculateStringsSize([[text]], fontFamily, fontSize);
			const {height: heightText, width: widthText} = sizes[0];

			if (height > heightText && width > widthText) {
				return <Label {...props} />;
			}
		}

		return null;
	}
}

export default BarLabel;
