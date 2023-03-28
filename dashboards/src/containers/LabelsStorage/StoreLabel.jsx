// @flow
import {calculateStringsSize} from 'src/utils/recharts';
import type {Context, StoreLabelProps as Props} from './types';
import {generateLabelKey} from './helpers';
import {LABELS_STORAGE_CONTEXT} from './constants';
import React, {PureComponent} from 'react';

export class StoreLabel extends PureComponent<Props> {
	static defaultProps = {
		className: '',
		dataKey: '',
		fontFamily: 'Roboto',
		fontSize: 12,
		force: false,
		height: 0,
		name: '',
		value: 0,
		viewBox: {height: 0, width: 0, x: 0, y: 0},
		width: 0,
		x: 0,
		y: 0
	};

	registerLabel = (context: Context) => {
		const {fontFamily, fontSize, force, formatter, height, value, width} = this.props;
		const key = generateLabelKey(this.props);

		let register = false;

		if (height >= 1 && width >= 1) { // Проверка на нулевые области
			register = true;
		}

		//Старый вариант кода с проверкой, вмещается ли подпись в размер бара
		// let register = false;

		// if (height >= 1 && width >= 1) { // Проверка на нулевые области
		// 	if (force) {
		// 		register = true;
		// 	} else {
		// 		const text = formatter ? formatter(value, this.props) : value.toString();

		// 		const sizes = calculateStringsSize([[text]], fontFamily, fontSize);
		// 		const {height: heightText, width: widthText} = sizes[0];

		// 		if (height > heightText && width > widthText) {
		// 			register = true;
		// 		}
		// 	}
		// }

		if (register) {
			context.registerLabel(key, this.props);
		} else {
			context.unregisterLabel(key);
		}
	};

	render () {
		return (
			<LABELS_STORAGE_CONTEXT.Consumer>
				{this.registerLabel}
			</LABELS_STORAGE_CONTEXT.Consumer>
		);
	}
}

export default StoreLabel;
