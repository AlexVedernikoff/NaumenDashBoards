// @flow
import {AXIS_FORMAT_TYPE} from 'store/widgets/data/constants';
import LabelParameterFormat from './components/LabelParameterFormat';
import NumberParameterFormat from './components/NumberParameterFormat';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParameterFormatPanel extends PureComponent<Props> {
	render () {
		const {label, onChange, value} = this.props;
		const {INTEGER_FORMAT, LABEL_FORMAT, NUMBER_FORMAT} = AXIS_FORMAT_TYPE;

		if (value) {
			if (value.type === LABEL_FORMAT) {
				return <LabelParameterFormat label={label} onChange={onChange} value={value} />;
			}

			if (value.type === NUMBER_FORMAT || value.type === INTEGER_FORMAT) {
				const showSymbolCount = value.type === NUMBER_FORMAT;
				return <NumberParameterFormat onChange={onChange} showSymbolCount={showSymbolCount} value={value} />;
			}
		}

		return null;
	}
}
