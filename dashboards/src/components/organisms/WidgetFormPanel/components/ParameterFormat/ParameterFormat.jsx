// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {getDefaultFormatForParameter, getMainDataSet} from 'store/widgets/data/helpers';
import ParameterFormatPanel from 'components/molecules/ParameterFormatPanel';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ParameterFormat extends PureComponent<Props> {
	handleChangeFormat = (format, callback) => {
		const {onChange, parameter} = this.props;
		const newValue = {...parameter, format};

		onChange(DIAGRAM_FIELDS.parameter, newValue, callback);
	};

	render () {
		const {data, parameter} = this.props;
		const {parameters} = getMainDataSet(data);

		if (parameters && parameters.length > 0) {
			const {attribute, group} = parameters[0];

			if (attribute) {
				const {format = getDefaultFormatForParameter(attribute, group)} = parameter;
				const label = attribute.title;

				return (
					<ParameterFormatPanel label={label} onChange={this.handleChangeFormat} value={format} />
				);
			}
		}

		return null;
	}
}

export default ParameterFormat;
