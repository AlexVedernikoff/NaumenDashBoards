// @flow
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
		height: 0,
		name: '',
		value: 0,
		viewBox: {height: 0, width: 0, x: 0, y: 0},
		width: 0,
		x: 0,
		y: 0
	};

	registerLabel = (context: Context) => {
		const {height, width} = this.props;
		const key = generateLabelKey(this.props);

		if (height >= 1 && width >= 1) { // Проверка на нулевые области
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
