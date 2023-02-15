// @flow
import {AXIS_FORMAT_TYPE} from 'store/widgets/data/constants';
import DTIntervalFormat from './components/DTIntervalFormat';
import LabelParameterFormat from './components/LabelParameterFormat';
import NumberParameterFormat from './components/NumberParameterFormat';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParameterFormatPanel extends PureComponent<Props> {
	render () {
		const {label, onChange, title, value} = this.props;
		const {DT_INTERVAL_FORMAT, INTEGER_FORMAT, LABEL_FORMAT, NUMBER_FORMAT} = AXIS_FORMAT_TYPE;

		if (value) {
			if (value.type === LABEL_FORMAT) {
				return <LabelParameterFormat label={label} onChange={onChange} value={value} />;
			}

			if (value.type === NUMBER_FORMAT || value.type === INTEGER_FORMAT) {
				const showSymbolCount = value.type === NUMBER_FORMAT;
				return <NumberParameterFormat onChange={onChange} showSymbolCount={showSymbolCount} value={value} />;
			}

			if (value.type === DT_INTERVAL_FORMAT) {
				return <DTIntervalFormat onChange={onChange} title={title} value={value} />;
			}
		}

		return null;
	}
}
